from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "secretkey"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    RESET_PASSWORD_SECRET_KEY: str = "secretkey"
    RESET_PASSWORD_ALGORITHM: str = "HS256"
    RESET_PASSWORD_EXPIRE_MINUTES: int = 30

    DB_DATABASE: str = "test.db"

    STORAGE_PATH: str = "storage"

    EMAIL_USERNAME: str
    EMAIL_PASSWORD: str
    EMAIL_FROM: str
    EMAIL_PORT: int
    EMAIL_SERVER: str

    FRONTEND_URL: str = "http://localhost:5173"
    RESET_PASSWORD_URL: str = "/restablecer-contrasena"

    ORIGINS: list[str] = [
        "http://localhost",
        "http://localhost:5173",
    ]

    THUMBNAIL_SUPPORTED_EXTENSIONS: list[str] = [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "mp4",
        "avi",
        "mov",
        "pdf",
    ]
    THUMBNAIL_SUPPORTED_MIME_TYPES: list[str] = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/avi",
        "video/quicktime",
        "application/pdf",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
