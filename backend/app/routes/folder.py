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
    # Validar carpeta padre
    parent_folder = get_folder_by_id(db, parent_id)
    if parent_id != 0 and not parent_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta padre no encontrada.",
        )

    # Comprobar si ya existe una carpeta con el mismo nombre
    if check_same_name(db, parent_id, folder.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una carpeta con el mismo nombre.",
        )

    # Crear la carpeta en la base de datos
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

    # Crear un buffer en memoria para el ZIP
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        # Agregar archivos de la carpeta raíz
        for file in root_files:
            file_data = get_file_content(file)
            zip_file.writestr(f"{base_path}{file.filename}", file_data)

        # Agregar subcarpetas y su contenido recursivamente
        add_folder_to_zip(db, zip_file, root_folders, base_path)

    # Ajustar la posición del buffer al inicio
    zip_buffer.seek(0)

    # Nombre del archivo ZIP
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    folder_name = folder_name.strip().replace(" ", "_")
    zip_filename = f"{folder_name}_{timestamp}.zip"
    print(zip_filename)

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

        # Agregar la carpeta al ZIP (aunque esté vacía)
        zip_file.writestr(folder_path, "")

        # Obtener archivos de esta carpeta
        files = folder.files
        for file in files:
            file_data = get_file_content(file)
            zip_file.writestr(f"{folder_path}{file.filename}", file_data)

        # Obtener subcarpetas y procesarlas recursivamente
        subfolders = folder.subfolders
        add_folder_to_zip(db, zip_file, subfolders, folder_path)


def get_file_content(file: File) -> bytes:
    """Obtener el contenido de un archivo desde el sistema de almacenamiento."""
    with open(file.storage_path, "rb") as f:
        return f.read()
