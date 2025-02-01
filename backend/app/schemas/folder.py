from pydantic import BaseModel, computed_field

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

    @computed_field(return_type=int)
    @property
    def num_elements(self):
        return len(self.files) + len(self.subfolders)

    @computed_field(return_type=int)
    @property
    def num_files(self):
        return len(self.files)

    @computed_field(return_type=int)
    @property
    def num_subfolders(self):
        return len(self.subfolders)
