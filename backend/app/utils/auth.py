from typing import Annotated

from app.crud.user import get_user_by_username
from app.database.connection import SessionDep
from app.schemas.user import UserInDB, UserOut
from app.utils.security import decode_access_token
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

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
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_by_username(db, username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontró el usuario autenticado.",
        )

    return user


CurrentUserDep = Annotated[UserOut, Depends(get_current_user)]
CurrentUserInDBDep = Annotated[UserInDB, Depends(get_current_user)]
