from app.models.folder import Folder
from sqlmodel import Session


def create_folder(db: Session, folder: Folder):
    db.add(folder)
    db.commit()
    db.refresh(folder)
    return folder


def get_folder_by_id(db: Session, folder_id: int):
    return db.get(Folder, folder_id)
