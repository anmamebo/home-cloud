import os
import uuid
from datetime import datetime

from app.config import settings
from app.crud.file import (
    check_same_name,
    create_file,
    delete_file,
    get_file_by_id,
    update_file,
)
from app.crud.folder import get_folder_by_id
from app.database.connection import SessionDep
from app.models.file import File
from app.schemas.file import FileIn, FileOut
from app.utils.auth import CurrentUserDep
from fastapi import APIRouter
from fastapi import File as FastAPIFile
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/filesystem/files",
    tags=["filesystem"],
)


@router.post("/", response_model=FileOut)
def upload_file(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int = 0,
    file: UploadFile = FastAPIFile(...),
):
    # Check if the folder exists
    folder = get_folder_by_id(db, folder_id)
    if folder_id != 0 and not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    # Check if a file with the same name already exists
    if check_same_name(db, folder_id, file.filename):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
        )

    # Generate a unique name for storage
    unique_filename = f"{uuid.uuid4().hex}{os.path.splitext(file.filename)[-1]}"
    storage_path = os.path.join(settings.STORAGE_PATH, unique_filename)

    # Saving the file physically
    with open(storage_path, "wb") as buffer:
        buffer.write(file.file.read())

    # Create the file record in the database
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
    current_user: CurrentUserDep,
    file_id: int,
):
    file = get_file_by_id(db, file_id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Update access
    file.last_accessed_at = datetime.now()
    file.last_accessed_by = current_user.id
    file.download_count += 1
    db.commit()

    return FileResponse(file.storage_path, filename=file.filename)


@router.delete("/{file_id}")
def delete_file_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    file_id: int,
):
    file = get_file_by_id(db, file_id)
    if not file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Delete record from database
    delete_file(db, file)

    # Delete file from file system
    os.remove(file.storage_path)

    return {"message": "Archivo eliminado correctamente."}


@router.patch("/{file_id}", response_model=FileOut)
def update_file_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    file_id: int,
    file: FileIn,
):
    # Get database file
    file_db = get_file_by_id(db, file_id)
    if not file_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    # Check if the file name has changed
    if "filename" in file:
        new_filename = file["filename"]

        # Check if a file with the same name already exists
        if check_same_name(db, file_db.folder_id, new_filename):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
            )

    # Update file fields
    return update_file(db, file_db, file)


@router.put(
    "/{file_id}/move/{new_folder_id}",
    response_model=FileOut,
    status_code=status.HTTP_200_OK,
)
def move_file_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    file_id: int,
    new_folder_id: int,
):
    file_db = get_file_by_id(db, file_id)
    if not file_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    if new_folder_id != 0:
        folder = get_folder_by_id(db, new_folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta destino no encontrada.",
            )

    # Check if a file with the same name already exists
    if check_same_name(db, new_folder_id, file_db.filename):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
        )

    file_db.folder_id = new_folder_id
    db.commit()
    db.refresh(file_db)

    return file_db
