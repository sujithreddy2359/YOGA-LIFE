from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class AwarenessArticle(Base):
    __tablename__ = "awareness_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), default="Philosophy")  # Philosophy, Anatomy, Breathing, History, Lifestyle
    reading_time_minutes = Column(Integer, default=3)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    did_you_know = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    day_of_year_index = Column(Integer, default=1)  # For daily rotation
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AwarenessProgress(Base):
    __tablename__ = "awareness_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    article_id = Column(Integer, ForeignKey("awareness_articles.id", ondelete="CASCADE"), nullable=False)
    is_completed = Column(Boolean, default=True)
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="awareness_progress")
    article = relationship("AwarenessArticle")
