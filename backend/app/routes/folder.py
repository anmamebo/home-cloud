from typing import Annotated

from app.crud.folder import (
    check_same_name,
    create_folder,
    get_folder_by_id,
    get_root_folder,
    update_folder,
)
from app.crud.user import get_user_by_username
from app.database.connection import SessionDep
from app.models.folder import Folder
from app.schemas.folder import FolderContent, FolderIn, FolderOut
from app.schemas.user import UserOut
from app.utils.security import decode_access_token
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/filesystem/folders",
    tags=["filesystem"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: SessionDep):
    """Get the current user from the access token."""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username = payload.get("sub")
    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    return user


@router.post("/", response_model=FolderOut)
def create_folder_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder: FolderIn,
    parent_id: int = 0,
):
    # Validar carpeta padre
    parent_folder = get_folder_by_id(db, parent_id)
    if parent_id != 0 and not parent_folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta padre no encontrada.",
        )

    # Comprobar si ya existe una carpeta con el mismo nombre
    if check_same_name(db, parent_id, folder.name):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe una carpeta con el mismo nombre.",
        )

    # Crear la carpeta en la base de datos
    new_folder = Folder(
        name=folder.name,
        parent_id=parent_id,
        user_id=current_user.id,
    )
    return create_folder(db, new_folder)


@router.get("/{folder_id}", response_model=FolderContent)
def get_folder_contents_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder_id: int,
):
    if folder_id == 0:
        return get_root_folder(db)

    folder = get_folder_by_id(db, folder_id)
    if not folder:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )
    return folder


@router.patch("/{folder_id}", response_model=FolderOut)
def update_folder_route(
    db: SessionDep,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    folder_id: int,
    folder: FolderIn,
):
    folder_db = get_folder_by_id(db, folder_id)
    if not folder_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Carpeta no encontrada.",
        )

    return update_folder(db, folder_db, folder)
