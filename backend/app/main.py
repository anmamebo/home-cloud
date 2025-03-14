import os
from contextlib import asynccontextmanager

from app.config import settings
from app.database.connection import create_db_and_tables
from app.routes import auth, file, folder
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicialization of the database and tables."""
    create_db_and_tables()  # Run before the app starts
    yield  # Here FastAPI runs the application normally


app = FastAPI(
    title="HomeCloud API",
    version="0.1",
    contact={
        "name": "Antonio Manuel",
        "url": "https://github.com/anmamebo",
        "email": "anmamebo2001@gmail.com",
    },
    lifespan=lifespan,
)

# The storage directory is created if it does not exist
if not os.path.exists(settings.STORAGE_PATH):
    os.makedirs(settings.STORAGE_PATH)

# Middleware to allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# Routes
app.include_router(auth.router)
app.include_router(folder.router)
app.include_router(file.router)

app.mount("/static", StaticFiles(directory=settings.STORAGE_PATH), name="static")


@app.get("/")
def read_root():
    return {"Hello": "World"}
