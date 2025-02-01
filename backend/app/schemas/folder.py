from pydantic import BaseModel

from .file import FileOut


class FolderBase(BaseModel):
    name: str


class FolderIn(FolderBase):
    pass


class FolderOut(FolderBase):
    id: int

    class Config:
        from_attributes = True


class FolderContent(FolderOut):
    files: list[FileOut] = []
    subfolders: list[FolderOut] = []
