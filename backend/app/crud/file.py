from datetime import datetime

from app.enums import ActionType
from app.models.file import File
from app.schemas.file import FileIn
from sqlmodel import Session, select


def create_file(
    db: Session, user_id: int, file: File, action: ActionType = ActionType.CREATE
):
    db.add(file)
    db.commit()
    db.refresh(file)

    file.log_action(
        db,
        action=action,
        user_id=user_id,
        details="File created.",
    )

    return file


def get_file_by_id(db: Session, file_id: int):
    return db.get(File, file_id)


def get_file_in_folder_by_name(db: Session, folder_id: int, name: str):
    return db.exec(
        select(File).where(File.folder_id == folder_id, File.filename == name)
    ).first()


def update_file(db: Session, user_id: int, file: File, update_data: FileIn):
    file_data = update_data.model_dump(exclude_unset=True)
    file.sqlmodel_update(file_data)
    file.updated_at = datetime.now()
    db.add(file)
    db.commit()
    db.refresh(file)

    file.log_action(
        db,
        action=ActionType.UPDATE,
        user_id=user_id,
        details="File updated.",
    )

    return file


def delete_file(db: Session, user_id: int, file: File):
    db.delete(file)
    db.commit()

    file.log_action(
        db,
        action=ActionType.DELETE,
        user_id=user_id,
        details="File deleted.",
    )


def check_same_name(db: Session, folder_id: int, name: str) -> bool:
    """Check if a file with the same name exists in the folder."""
    return (
        db.exec(
            select(File).where(File.filename == name, File.folder_id == folder_id)
        ).first()
        is not None
    )
