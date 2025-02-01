from datetime import datetime

from app.models.file import File
from app.schemas.file import FileIn
from sqlmodel import Session, select


def create_file(db: Session, file: File):
    db.add(file)
    db.commit()
    db.refresh(file)
    return file


def get_file_by_id(db: Session, file_id: int):
    return db.get(File, file_id)


def update_file(db: Session, file: File, update_data: FileIn):
    file_data = update_data.model_dump(exclude_unset=True)
    file.sqlmodel_update(file_data)
    file.updated_at = datetime.now()
    db.add(file)
    db.commit()
    db.refresh(file)

    return file


def delete_file(db: Session, file: File):
    db.delete(file)
    db.commit()


def check_same_name(db: Session, folder_id: int, name: str) -> bool:
    return (
        db.exec(
            select(File).where(File.filename == name, File.folder_id == folder_id)
        ).first()
        is not None
    )
