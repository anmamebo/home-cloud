import os
from datetime import datetime
from typing import Annotated

from app.config import settings
from app.crud.file import create_file, delete_file, get_file_by_id, update_file
from app.crud.folder import create_folder, get_folder_by_id
from app.database.connection import SessionDep
from app.models.file import File
from app.models.folder import Folder
from app.schemas.file import FileOut
from app.schemas.folder import FolderContent, FolderIn, FolderOut
from app.schemas.user import UserOut
from app.utils.security import decode_access_token
from fastapi import APIRouter, Depends
from fastapi import File as FastAPIFile
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/filesystem",
    tags=["filesystem"],
)
from app.crud.user import get_user_by_username

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep):
    """Get the current user from the access token."""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username = payload.get("sub")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    return user


@router.post("/folders", response_model=FolderOut)
def create_folder_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder: FolderIn,
    parent_id: int | None = None,
):
    # Crear la ruta de la carpeta
    if parent_id:
        parent_folder = get_folder_by_id(db, parent_id)
        if not parent_folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta padre no encontrada.",
            )
        folder_path = os.path.join(parent_folder.path, folder.name)
    else:
        folder_path = os.path.join(settings.STORAGE_PATH, folder.name)

    # Crear la carpeta en el sistema de archivos
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    else:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="La carpeta ya existe.",
        )

    # Crear la carpeta en la base de datos
    folder = Folder(
        name=folder.name,
        path=folder_path,
        parent_id=parent_id,
        user_id=current_user.id,
    )
    return create_folder(db, folder)


@router.get("/folders/{folder_id}", response_model=FolderContent)
def get_folder_contents_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder_id: int,
):
    folder = get_folder_by_id(db, folder_id)

    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )
    return folder


@router.post("/files/upload", response_model=FileOut)
def upload_file(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder_id: int | None = None,
    file: UploadFile = FastAPIFile(...),
):
    # Determinar la carpeta de destino
    if folder_id:
        folder = get_folder_by_id(db, folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta no encontrada.",
            )
        filepath = os.path.join(folder.path, file.filename)
    else:
        filepath = os.path.join(settings.STORAGE_PATH, file.filename)

    # Guardar el archivo en el sistema de archivos
    with open(filepath, "wb") as buffer:
        buffer.write(file.file.read())

    # Crear el registro del archivo en la base de datos
    db_file = File(
        filename=file.filename,
        filepath=filepath,
        filetype=file.content_type,
        filesize=os.path.getsize(filepath),
        folder_id=folder_id,
        user_id=current_user.id,
    )
    return create_file(db, db_file)


@router.get("/files/download/{file_id}")
def download_file(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    file_id: int,
):
    file = get_file_by_id(db, file_id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Actualizar campos de acceso
    file.last_accessed_at = datetime.now()
    file.last_accessed_by = current_user.id
    file.download_count += 1
    db.commit()

    return FileResponse(file.filepath, filename=file.filename)


@router.delete("/files/{file_id}")
def delete_file_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    file_id: int,
):
    file = get_file_by_id(db, file_id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Eliminar registro de la base de datos
    delete_file(db, file)

    # Eliminar archivo del sistema de archivos
    os.remove(file.filepath)

    return {"message": "Archivo eliminado correctamente."}


@router.patch("/files/{file_id}", response_model=FileOut)
def update_file_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    file_id: int,
    update_data: dict,
):
    # Obtener el archivo de la base de datos
    file = get_file_by_id(db, file_id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Comprobar si el nombre del archivo ha cambiado
    if "filename" in update_data:
        new_filename = update_data["filename"]

        # Construir la nueva ruta del archivo
        if file.folder_id:
            folder = get_folder_by_id(db, file.folder_id)
            if not folder:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Carpeta no encontrada.",
                )
            new_filepath = os.path.join(folder.path, new_filename)
        else:
            new_filepath = os.path.join(settings.STORAGE_PATH, new_filename)

        # Renombrar el archivo en el sistema de archivos
        try:
            os.rename(file.filepath, new_filepath)
        except OSError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"No se puedo renombrar el archivo: {e}",
            )

        # Actualizar el metadata del archivo en la base de datos
        update_data["filepath"] = new_filepath

    # Actualizar los campos del archivo
    updated_file = update_file(db, file, update_data)
    return updated_file
