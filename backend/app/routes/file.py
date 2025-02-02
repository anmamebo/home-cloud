import os
import uuid
from datetime import datetime
from typing import Annotated

from app.config import settings
from app.crud.file import (
    check_same_name,
    create_file,
    delete_file,
    get_file_by_id,
    update_file,
)
from app.crud.folder import get_folder_by_id
from app.crud.user import get_user_by_username
from app.database.connection import SessionDep
from app.models.file import File
from app.schemas.file import FileIn, FileOut
from app.schemas.user import UserOut
from app.utils.security import decode_access_token
from fastapi import APIRouter, Depends
from fastapi import File as FastAPIFile
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/filesystem/files",
    tags=["filesystem"],
)

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


@router.post("/", response_model=FileOut)
def upload_file(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder_id: int = 0,
    file: UploadFile = FastAPIFile(...),
):
    # Comprobar si la carpeta existe
    folder = get_folder_by_id(db, folder_id)
    if folder_id != 0 and not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    # Comprobar si ya existe un archivo con el mismo nombre
    if check_same_name(db, folder_id, file.filename):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
        )

    # Generar un nombre único para el almacenamiento
    unique_filename = f"{uuid.uuid4().hex}{os.path.splitext(file.filename)[-1]}"
    storage_path = os.path.join(settings.STORAGE_PATH, unique_filename)

    # Guardar el archivo físicamente
    with open(storage_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Crear el registro del archivo en la base de datos
    db_file = File(
        filename=file.filename,
        storage_path=storage_path,
        filetype=file.content_type,
        filesize=os.path.getsize(storage_path),
        folder_id=folder_id,
        user_id=current_user.id,
    )
    return create_file(db, db_file)


@router.get("/{file_id}/download")
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

    # Actualizar acceso
    file.last_accessed_at = datetime.now()
    file.last_accessed_by = current_user.id
    file.download_count += 1
    db.commit()

    return FileResponse(file.storage_path, filename=file.filename)


@router.delete("/{file_id}")
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
    os.remove(file.storage_path)

    return {"message": "Archivo eliminado correctamente."}


@router.patch("/{file_id}", response_model=FileOut)
def update_file_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    file_id: int,
    file: FileIn,
):
    # Obtener el archivo de la base de datos
    file_db = get_file_by_id(db, file_id)
    if not file_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Verificar si el nombre del archivo ha cambiado
    if "filename" in file:
        new_filename = file["filename"]

        # Comprobar si ya existe un archivo con el mismo nombre
        if check_same_name(db, file_db.folder_id, new_filename):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
            )

    # Actualizar los campos del archivo
    return update_file(db, file_db, file)
