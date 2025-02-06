from datetime import datetime

from app.crud.user import create_user, get_user_by_email, get_user_by_username
from app.database.connection import SessionDep
from app.schemas.user import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    Token,
    UserIn,
    UserOut,
)
from app.utils.auth import CurrentUserDep, CurrentUserInDBDep
from app.utils.email import send_reset_password_email
from app.utils.security import (
    create_access_token,
    decode_password_reset_token,
    generate_password_reset_token,
    get_password_hash,
    verify_password,
)
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.get(
    "/me",
    response_model=UserOut,
    status_code=status.HTTP_200_OK,
    summary="Get the current user",
    description="Get the current user information.",
)
def read_users_me(current_user: CurrentUserDep):
    return current_user


@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Register a new user with the provided username, email, and password.",
)
def register(user: UserIn, db: SessionDep):
    db_user = get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El usuario ya existe.",
        )
    return create_user(db, user)


@router.post(
    "/login",
    response_model=Token,
    status_code=status.HTTP_200_OK,
    summary="Login",
    description="Login with the provided username and password.",
)
def login(db: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()) -> Token:
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update the last access date
    user.last_login = datetime.now()
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")


@router.post(
    "/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Change password",
    description="Change the current user's password.",
)
def change_password(
    db: SessionDep,
    current_user: CurrentUserInDBDep,
    password_data: ChangePasswordRequest,
):
    if not verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual es incorrecta.",
        )

    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    db.refresh(current_user)
    return None


@router.post(
    "/forgot-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Forgot password",
    description="Send an email with a password reset link.",
)
def forgot_password(
    email_data: ForgotPasswordRequest, db: SessionDep, background_tasks: BackgroundTasks
):
    user = get_user_by_email(db, email_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    reset_token = generate_password_reset_token(user.email)
    background_tasks.add_task(send_reset_password_email, user.email, reset_token)
    return None


@router.post(
    "/reset-password",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Reset password",
    description="Reset the user's password.",
)
def reset_password(password_data: ResetPasswordRequest, db: SessionDep):
    email = decode_password_reset_token(password_data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El token es inválido o ha expirado.",
        )

    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado.",
        )

    user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    db.refresh(user)
    return None
