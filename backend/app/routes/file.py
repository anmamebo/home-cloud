import os
import shutil
import uuid
from datetime import datetime
from typing import List

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
from app.enums import ActionType
from app.models.file import File
from app.schemas.file import FileIn, FileOut
from app.utils.auth import CurrentUserDep
from app.utils.filesystem import generate_copy_filename, generate_thumbnail
from fastapi import APIRouter
from fastapi import File as FastAPIFile
from fastapi import HTTPException, UploadFile, status
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/filesystem/files",
    tags=["files"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=List[FileOut],
    status_code=status.HTTP_201_CREATED,
    summary="Upload a new file or multiple files",
    description="Upload a new file or multiple files to the filesystem.",
)
def upload_file(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int = 0,
    files: List[UploadFile] = FastAPIFile(...),
):
    # Check if the folder exists
    folder = get_folder_by_id(db, folder_id)
    if folder_id != 0 and not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    uploaded_files = []

    for file in files:
        # Check if a file with the same name already exists
        if check_same_name(db, folder_id, file.filename):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Ya existe un archivo con el mismo nombre en esta carpeta.",
            )

        # Generate a unique name for storage
        uuid_str = uuid.uuid4().hex
        unique_filename = f"{uuid_str}{os.path.splitext(file.filename)[-1]}"
        relative_storage_path = unique_filename
        storage_path = os.path.join(settings.STORAGE_PATH, relative_storage_path)

        # Saving the file physically
        with open(storage_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Generate thumbnail if the file is supported
        relative_thumbnail_path = None
        file_extension = file.filename.lower().split(".")[-1]
        if (
            file_extension in settings.THUMBNAIL_SUPPORTED_EXTENSIONS
            and file.content_type in settings.THUMBNAIL_SUPPORTED_MIME_TYPES
        ):
            thumbnail_filename = f"{uuid_str}.webp"
            relative_thumbnail_path = os.path.join("thumbnails", thumbnail_filename)
            thumbnail_path = os.path.join(
                settings.STORAGE_PATH, relative_thumbnail_path
            )

            os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)

            generate_thumbnail(storage_path, thumbnail_path)

        # Create the file record in the database
        db_file = File(
            filename=file.filename,
            storage_path=relative_storage_path,
            thumbnail_path=relative_thumbnail_path,
            filetype=file.content_type,
            filesize=os.path.getsize(storage_path),
            folder_id=folder_id,
            user_id=current_user.id,
        )

        created_file = create_file(
            db, current_user.id, db_file, action=ActionType.UPLOAD
        )
        uploaded_files.append(created_file)

    return uploaded_files


@router.get(
    "/{file_id}/download",
    response_class=FileResponse,
    status_code=status.HTTP_200_OK,
    summary="Download a file",
    description="Download a file from the filesystem.",
)
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

    file.log_action(
        db,
        action=ActionType.DOWNLOAD,
        user_id=current_user.id,
        details="File downloaded.",
    )

    absolute_storage_path = os.path.join(settings.STORAGE_PATH, file.storage_path)

    return FileResponse(absolute_storage_path, filename=file.filename)


@router.delete(
    "/{file_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete file",
    description="Delete a file from the filesystem.",
)
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
    delete_file(db, current_user.id, file)

    # Delete file from file system
    absolute_storage_path = os.path.join(settings.STORAGE_PATH, file.storage_path)
    os.remove(absolute_storage_path)

    return None


@router.patch(
    "/{file_id}",
    response_model=FileOut,
    status_code=status.HTTP_200_OK,
    summary="Update file",
    description="Update the file metadata.",
)
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
    return update_file(db, current_user.id, file_db, file)


@router.put(
    "/{file_id}/move/{new_folder_id}",
    response_model=FileOut,
    status_code=status.HTTP_200_OK,
    summary="Move file",
    description="Move a file to a different folder.",
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

    file_db.log_action(
        db,
        action=ActionType.UPDATE,
        user_id=current_user.id,
        details="File moved.",
    )

    return file_db


@router.post(
    "/{file_id}/copy",
    response_model=FileOut,
    status_code=status.HTTP_201_CREATED,
    summary="Copy file",
    description="Copy a file to the same folder.",
)
def make_file_copy_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    file_id: int,
):
    file_db = get_file_by_id(db, file_id)
    if not file_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado.",
        )

    new_filename = generate_copy_filename(db, file_db.folder_id, file_db.filename)

    # Generate a unique name for storage
    unique_filename = f"{uuid.uuid4().hex}{os.path.splitext(new_filename)[-1]}"
    relative_storage_path = unique_filename
    storage_path = os.path.join(settings.STORAGE_PATH, relative_storage_path)

    file_db_storage_path = os.path.join(settings.STORAGE_PATH, file_db.storage_path)
    shutil.copy(file_db_storage_path, storage_path)

    # Create a new file record
    new_file = File(
        filename=new_filename,
        folder_id=file_db.folder_id,
        user_id=current_user.id,
        storage_path=relative_storage_path,
        filesize=file_db.filesize,
        filetype=file_db.filetype,
    )

    return create_file(db, current_user.id, new_file)
