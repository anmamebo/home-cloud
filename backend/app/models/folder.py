from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .file import File
    from .user import User


class Folder(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    path: str = Field(unique=True, index=True)

    parent_id: int | None = Field(default=None, foreign_key="folder.id")
    user_id: int = Field(foreign_key="user.id")

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    last_accessed_at: datetime | None = None
    last_accessed_by: int | None = Field(default=None, foreign_key="user.id")

    files: list["File"] = Relationship(
        back_populates="folder",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    subfolders: list["Folder"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )
    parent: Optional["Folder"] = Relationship(
        back_populates="subfolders", sa_relationship_kwargs={"remote_side": "Folder.id"}
    )

    user: "User" = Relationship(
        back_populates="folders",
        sa_relationship_kwargs={"foreign_keys": "Folder.user_id"},
    )
