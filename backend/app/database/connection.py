from typing import Annotated

from app.config import settings
from app.models.file import File
from app.models.folder import Folder
from app.models.user import User
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

# Database connection URL (SQLite in this case)
SQLITE_DATABASE_URL = f"sqlite:///./{settings.DB_DATABASE}"

# Create the database engine
connect_args = {"check_same_thread": False}
engine = create_engine(SQLITE_DATABASE_URL, connect_args=connect_args)


# Create the database and tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# Get a database session
def get_session():
    with Session(engine) as session:
        yield session


# Dependency to get a session from the database
SessionDep = Annotated[Session, Depends(get_session)]
