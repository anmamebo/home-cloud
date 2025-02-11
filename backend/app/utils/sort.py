from enum import Enum
from typing import Optional


class SortByFolders(str, Enum):
    NAME = "name"
    CREATED_AT = "created_at"


class SortByFiles(str, Enum):
    FILENAME = "filename"
    CREATED_AT = "created_at"
    FILESIZE = "filesize"


class OrderDirection(str, Enum):
    ASC = "asc"
    DESC = "desc"


def sort_items(items, sort_by: Optional[str], order: Optional[str]):
    """Sort a list of items by a field and order direction."""
    if not sort_by:
        return
    reverse = order == "desc"
    items.sort(
        key=lambda x: (
            getattr(x, sort_by, "").lower()
            if isinstance(getattr(x, sort_by, ""), str)
            else getattr(x, sort_by, "")
        ),
        reverse=reverse,
    )
