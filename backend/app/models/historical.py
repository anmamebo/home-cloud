from datetime import datetime
from typing import Optional

from app.enums import ActionType, EntityType
from sqlmodel import Field, Session, SQLModel


class HistoryLog(SQLModel, table=True):
    """Model for storing historical logs."""

    id: Optional[int] = Field(default=None, primary_key=True)
    entity_type: EntityType
    entity_id: int
    action: ActionType
    details: Optional[str] = None
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    timestamp: datetime = Field(default_factory=datetime.now)


class AuditableModel(SQLModel):
    """Base class for models that require auditing."""

    def log_action(
        self,
        session: Session,
        action: str,
        user_id: Optional[int] = None,
        details: Optional[str] = None,
    ):
        """
        Log an action performed on the entity.
        """
        history_log = HistoryLog(
            entity_type=self.__class__.__name__,
            entity_id=self.id,
            action=action,
            details=details,
            user_id=user_id,
        )
        session.add(history_log)
        session.commit()
