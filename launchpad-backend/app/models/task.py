from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    estimated_time = Column(Integer)  # minutes
    difficulty = Column(String(20))  # 'easy', 'medium', 'hard'
    order_index = Column(Integer, nullable=False)
    guide_slug = Column(String(100), index=True)  # links to guide
    created_at = Column(DateTime(timezone=True), server_default=func.now())
