from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserIn(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True  # Allows conversion of ORM objects to Pydantic models


class UserInDB(UserBase):
    hashed_password: str


class UserInUpdate(UserBase):
    pass


class UserOutUpdate(BaseModel):
    user: UserOut
    access_token: str


class Token(BaseModel):
    access_token: str
    token_type: str
    # user: UserResponse


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str
