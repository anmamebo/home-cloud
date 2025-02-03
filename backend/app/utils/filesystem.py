from app.models.file import File


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
