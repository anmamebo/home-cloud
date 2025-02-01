from pydantic import BaseModel


class FileBase(BaseModel):
    filename: str


class FileOut(FileBase):
    id: int
    filepath: str
    filetype: str
    filesize: int
    download_count: int
