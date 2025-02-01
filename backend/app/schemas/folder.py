from pydantic import BaseModel

from .file import FileOut


class FolderBase(BaseModel):
    name: str


class FolderIn(FolderBase):
    pass


class FolderOut(FolderBase):
    id: int
    path: str


class FolderContent(FolderOut):
    files: list[FileOut] = []
    subfolders: list[FolderOut] = []
