import os
from contextlib import asynccontextmanager

from app.config import settings
from app.database.connection import create_db_and_tables
from app.routes import auth
from fastapi import FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicialization of the database and tables."""
    create_db_and_tables()  # Ejecuta antes de que la app arranque
    yield  # Aquí FastAPI ejecuta la aplicación normalmente


app = FastAPI(lifespan=lifespan)

# Se crea el directorio de almacenamiento si no existe
if not os.path.exists(settings.STORAGE_PATH):
    os.makedirs(settings.STORAGE_PATH)

app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
