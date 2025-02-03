import os

from app.crud.file import delete_file
from app.crud.folder import delete_folder
from app.models.file import File
from app.models.folder import Folder
from sqlmodel import Session


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


def delete_folder_recursive(db: Session, folder: Folder):
    """Delete a folder and its contents recursively."""
    # Obtain and delete files in this folder
    for file in folder.files:
        delete_file_from_disk(file.storage_path)
        delete_file(db, file)

    # Obtain and delete subfolders recursively
    for subfolder in folder.subfolders:
        delete_folder_recursive(db, subfolder)

    # Finally, delete the folder itself
    delete_folder(db, folder)


def delete_file_from_disk(file_path: str):
    """Delete a file from the storage system."""
    if os.path.exists(file_path):
        os.remove(file_path)


def is_subfolder(folder: Folder, possible_parent: Folder) -> bool:
    """Check if 'possible_parent' is a subfolder of 'folder'."""
    while possible_parent:
        if possible_parent.id == folder.id:
            return True
        possible_parent = possible_parent.parent
    return False
