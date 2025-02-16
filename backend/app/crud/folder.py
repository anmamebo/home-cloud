from datetime import datetime
from typing import Optional

from app.enums import ActionType
from app.models.file import File
from app.models.folder import Folder
from app.schemas.folder import FolderIn
from app.utils.sort import sort_items
from sqlmodel import Session, select


def create_folder(
    db: Session, user_id: int, folder: Folder, action: ActionType = ActionType.CREATE
):
    db.add(folder)
    db.commit()
    db.refresh(folder)

    folder.log_action(
        db,
        action=action,
        user_id=user_id,
        details="Folder created.",
    )

    return folder


def update_folder(db: Session, user_id: int, folder: Folder, update_data: FolderIn):
    folder_data = update_data.model_dump(exclude_unset=True)
    folder.sqlmodel_update(folder_data)
    folder.updated_at = datetime.now()
    db.add(folder)
    db.commit()
    db.refresh(folder)

    folder.log_action(
        db,
        action=ActionType.UPDATE,
        user_id=user_id,
        details="Folder updated.",
    )

    return folder


def get_root_folder(
    db: Session,
    sort_by_folders: Optional[str],
    sort_by_files: Optional[str],
    order_folders: Optional[str],
    order_files: Optional[str],
):
    folders = db.exec(select(Folder).where(Folder.parent_id == 0)).all()
    files = db.exec(select(File).where(File.folder_id == 0)).all()

    root_folder = Folder(id=0, name="root", subfolders=folders, files=files)

    sort_items(root_folder.subfolders, sort_by_folders, order_folders)
    sort_items(root_folder.files, sort_by_files, order_files)

    return root_folder


def get_folder_by_id(
    db: Session,
    folder_id: int,
    sort_by_folders: Optional[str] = None,
    sort_by_files: Optional[str] = None,
    order_folders: Optional[str] = None,
    order_files: Optional[str] = None,
):
    query = select(Folder).where(Folder.id == folder_id)
    folder = db.exec(query).first()

    if not folder:
        return None

    sort_items(folder.subfolders, sort_by_folders, order_folders)
    sort_items(folder.files, sort_by_files, order_files)

    return folder


def delete_folder(db: Session, user_id: int, folder: Folder):
    db.delete(folder)
    db.commit()

    folder.log_action(
        db,
        action=ActionType.DELETE,
        user_id=user_id,
        details="Folder deleted.",
    )


def check_same_name(db: Session, parent_id: int, name: str) -> bool:
    """Check if a folder with the same name exists in the parent folder."""
    return (
        db.exec(
            select(Folder).where(Folder.name == name, Folder.parent_id == parent_id)
        ).first()
        is not None
    )
