import io
import zipfile
from datetime import datetime

from app.crud.folder import (
    check_same_name,
    create_folder,
    get_folder_by_id,
    get_root_folder,
    update_folder,
)
from app.database.connection import SessionDep
from app.models.file import File
from app.models.folder import Folder
from app.schemas.folder import FolderContent, FolderIn, FolderOut
from app.utils.auth import CurrentUserDep
from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/filesystem/folders",
    tags=["filesystem"],
)


@router.post("/", response_model=FolderOut)
def create_folder_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder: FolderIn,
    parent_id: int = 0,
):
    # Validate parent folder
    parent_folder = get_folder_by_id(db, parent_id)
    if parent_id != 0 and not parent_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta padre no encontrada.",
        )

    # Check if a folder with the same name already exists
    if check_same_name(db, parent_id, folder.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una carpeta con el mismo nombre.",
        )

    # Create the folder in the database
    new_folder = Folder(
        name=folder.name,
        parent_id=parent_id,
        user_id=current_user.id,
    )
    return create_folder(db, new_folder)


@router.get("/{folder_id}", response_model=FolderContent)
def get_folder_contents_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int,
):
    if folder_id == 0:
        return get_root_folder(db)

    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )
    return folder


@router.patch("/{folder_id}", response_model=FolderOut)
def update_folder_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int,
    folder: FolderIn,
):
    folder_db = get_folder_by_id(db, folder_id)
    if not folder_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    return update_folder(db, folder_db, folder)


@router.get("/{folder_id}/download")
def download_folder_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int,
):
    if folder_id == 0:
        folder_name = "root"
        base_path = ""
        root_folder = get_root_folder(db)
        root_folders = root_folder.subfolders
        root_files = root_folder.files
    else:
        folder = get_folder_by_id(db, folder_id)
        if not folder:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta no encontrada.",
            )
        folder_name = folder.name
        base_path = folder.name + "/"
        root_folders = folder.subfolders
        root_files = folder.files

    # Create an in-memory buffer for the ZIP
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Add files from the root folder
        for file in root_files:
            file_data = get_file_content(file)
            zip_file.writestr(f"{base_path}{file.filename}", file_data)

        # Adding subfolders and their contents recursively
        add_folder_to_zip(db, zip_file, root_folders, base_path)

    # Adjust the buffer position at startup
    zip_buffer.seek(0)

    # ZIP file name
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    folder_name = folder_name.strip().replace(" ", "_")
    zip_filename = f"{folder_name}_{timestamp}.zip"

    return StreamingResponse(
        content=zip_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": f"attachment; filename={zip_filename}",
            "Content-Type": "application/zip",
        },
    )


def add_folder_to_zip(db, zip_file, folders, parent_path):
    """Add a folder and its contents to a ZIP file recursively."""
    for folder in folders:
        folder_path = f"{parent_path}{folder.name}/"

        # Add folder to ZIP (even if it is empty)
        zip_file.writestr(folder_path, "")

        # Get files from this folder
        files = folder.files
        for file in files:
            file_data = get_file_content(file)
            zip_file.writestr(f"{folder_path}{file.filename}", file_data)

        # Get subfolders and process them recursively
        subfolders = folder.subfolders
        add_folder_to_zip(db, zip_file, subfolders, folder_path)


def get_file_content(file: File) -> bytes:
    """Get the contents of a file from the storage system."""
    with open(file.storage_path, "rb") as f:
        return f.read()
