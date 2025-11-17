from sqlalchemy import Column, Integer, Boolean, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.sql import func
from app.database import Base


class UserTaskProgress(Base):
    __tablename__ = "user_task_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False, index=True)
    completed = Column(Boolean, default=False, index=True)
    completed_at = Column(DateTime(timezone=True))
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint('user_id', 'task_id', name='unique_user_task'),
    )
