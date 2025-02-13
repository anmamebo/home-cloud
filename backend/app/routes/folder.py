import io
import os
import zipfile
from datetime import datetime
from typing import Optional

from app.crud.folder import (
    check_same_name,
    create_folder,
    get_folder_by_id,
    get_root_folder,
    update_folder,
)
from app.database.connection import SessionDep
from app.models.folder import Folder
from app.schemas.folder import FolderContent, FolderIn, FolderOut, FolderPath
from app.utils.auth import CurrentUserDep
from app.utils.filesystem import (
    add_folder_to_zip,
    delete_folder_recursive,
    get_file_content,
    is_subfolder,
)
from app.utils.sort import OrderDirection, SortByFiles, SortByFolders
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import StreamingResponse

router = APIRouter(
    prefix="/filesystem/folders",
    tags=["folders"],
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=FolderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new folder",
    description="Create a new folder in the filesystem.",
)
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


@router.get(
    "/{folder_id}",
    response_model=FolderContent,
    status_code=status.HTTP_200_OK,
    summary="Get folder contents",
    description="Get the contents of a folder.",
)
def get_folder_contents_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int,
    sort_by_folders: Optional[SortByFolders] = Query(
        default=None,
        description="Field to sort folders by. Allowed values: name, created_at.",
    ),
    sort_by_files: Optional[SortByFiles] = Query(
        default=None,
        description="Field to sort files by. Allowed values: filename, filesize, created_at.",
    ),
    order_folders: Optional[OrderDirection] = Query(
        default=None,
        description="Order direction for folders. Allowed values: asc, desc.",
    ),
    order_files: Optional[OrderDirection] = Query(
        default=None,
        description="Order direction for files. Allowed values: asc, desc.",
    ),
):
    sort_folders = sort_by_folders.value if sort_by_folders else None
    sort_files = sort_by_files.value if sort_by_files else None
    order_folders = order_folders.value if order_folders else None
    order_files = order_files.value if order_files else None

    if folder_id == 0:
        return get_root_folder(
            db,
            sort_folders,
            sort_files,
            order_folders,
            order_files,
        )

    folder = get_folder_by_id(
        db,
        folder_id,
        sort_folders,
        sort_files,
        order_folders,
        order_files,
    )

    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    return folder


@router.patch(
    "/{folder_id}",
    response_model=FolderOut,
    status_code=status.HTTP_200_OK,
    summary="Update folder",
    description="Update the folder name.",
)
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


@router.get(
    "/{folder_id}/download",
    status_code=status.HTTP_200_OK,
    summary="Download folder as ZIP",
    description="Download the contents of a folder as a ZIP file.",
)
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

    zip_buffer.seek(0, os.SEEK_END)
    zip_size = zip_buffer.tell()

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
            "Content-Length": str(zip_size),
        },
    )


@router.delete(
    "/{folder_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete folder",
    description="Delete a folder.",
)
def delete_folder_route(db: SessionDep, current_user: CurrentUserDep, folder_id: int):
    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    delete_folder_recursive(db, folder)

    return None


@router.put(
    "/{folder_id}/move/{new_parent_id}",
    response_model=FolderOut,
    status_code=status.HTTP_200_OK,
    summary="Move folder",
    description="Move a folder to a new parent folder.",
)
def move_folder_route(
    db: SessionDep,
    current_user: CurrentUserDep,
    folder_id: int,
    new_parent_id: int,
):
    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    # Verify that the new parent folder exists (except for the root folder)
    if new_parent_id != 0:
        new_parent = get_folder_by_id(db, new_parent_id)
        if not new_parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Carpeta destino no encontrada.",
            )

        # Do not allow moving a folder to itself
        if is_subfolder(folder, new_parent):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede mover una carpeta dentro de sí misma o de una subcarpeta.",
            )

    # Check if a folder with the same name already exists
    if check_same_name(db, new_parent_id, folder.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una carpeta con el mismo nombre.",
        )

    # Update at the database
    folder.parent_id = new_parent_id
    db.commit()
    db.refresh(folder)

    return folder


@router.get("/{folder_id}/path", response_model=FolderPath)
def get_folder_path(db: SessionDep, current_user: CurrentUserDep, folder_id: int):
    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    path = []
    current_folder = folder
    while current_folder:
        path.append(FolderOut(**current_folder.__dict__))
        current_folder = current_folder.parent

    path.reverse()
    return FolderPath(path=path)
