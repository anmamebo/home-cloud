from app.database.connection import create_db_and_tables
from app.routes import auth
from fastapi import FastAPI

app = FastAPI()


# TODO: Modificar el deprecated
@app.on_event("startup")
def on_startup():
    create_db_and_tables()


app.include_router(auth.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}
