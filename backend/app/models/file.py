from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .folder import Folder
    from .user import User


class File(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    filename: str = Field(index=True)
    storage_path: str = Field(unique=True)
    filetype: str
    filesize: int
    download_count: int = Field(default=0)
    description: str | None = None

    folder_id: int = Field(default=0, foreign_key="folder.id")
    user_id: int = Field(foreign_key="user.id")

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    last_accessed_at: datetime | None = None
    last_accessed_by: int | None = Field(default=None, foreign_key="user.id")

    folder: Optional["Folder"] = Relationship(back_populates="files")
    user: "User" = Relationship(
        back_populates="files",
        sa_relationship_kwargs={"foreign_keys": "File.user_id"},
    )
