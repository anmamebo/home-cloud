from enum import Enum


class EntityType(str, Enum):
    """Enum for entity types."""

    def __str__(self):
        return self.value

    FILE = "File"
    FOLDER = "Folder"


class ActionType(str, Enum):
    """Enum for action types."""

    def __str__(self):
        return self.value

    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    DOWNLOAD = "download"
    UPLOAD = "upload"
