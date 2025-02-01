from datetime import datetime

from app.models.file import File
from app.models.folder import Folder
from app.schemas.file import FileOut
from app.schemas.folder import FolderContent, FolderIn, FolderOut
from sqlmodel import Session, select


def create_folder(db: Session, folder: Folder):
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder


def update_folder(db: Session, folder: Folder, update_data: FolderIn):
    folder_data = update_data.model_dump(exclude_unset=True)
    folder.sqlmodel_update(folder_data)
    folder.updated_at = datetime.now()
    db.add(folder)
    db.commit()
    db.refresh(folder)

    return folder


def get_root_folder(db: Session):
    folders = db.exec(select(Folder).where(Folder.parent_id == 0)).all()
    files = db.exec(select(File).where(File.folder_id == 0)).all()

    files_out = [FileOut.model_validate(file) for file in files]
    folders_out = [FolderOut.model_validate(folder) for folder in folders]

    return FolderContent(id=0, name="root", subfolders=folders_out, files=files_out)


def get_folder_by_id(db: Session, folder_id: int):
    return db.get(Folder, folder_id)
