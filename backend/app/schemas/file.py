from pydantic import BaseModel


class FileBase(BaseModel):
    filename: str


class FileOut(FileBase):
    id: int
    storage_path: str
    filetype: str
    filesize: int
    download_count: int

    class Config:
        from_attributes = True
