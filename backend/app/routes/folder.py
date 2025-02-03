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
from app.models.folder import Folder
from app.schemas.folder import FolderContent, FolderIn, FolderOut
from app.utils.auth import CurrentUserDep
from app.utils.filesystem import (
    add_folder_to_zip,
    delete_folder_recursive,
    get_file_content,
    is_subfolder,
)
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


@router.delete("/{folder_id}")
def delete_folder_route(db: SessionDep, current_user: CurrentUserDep, folder_id: int):
    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    delete_folder_recursive(db, folder)

    return {"message": "Archivo eliminado correctamente."}


@router.put(
    "/{folder_id}/move/{new_parent_id}",
    response_model=FolderOut,
    status_code=status.HTTP_200_OK,
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
