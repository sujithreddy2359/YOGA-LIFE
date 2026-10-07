from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("yoga_sessions.id", ondelete="SET NULL"), nullable=True)
    entry_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    mood = Column(String(50), nullable=True)  # Great, Good, Relaxed, Okay, Tired
    energy_level = Column(Integer, nullable=True)  # 1 to 10
    practice_duration_minutes = Column(Integer, default=0)
    reflection_text = Column(Text, nullable=False)
    tags = Column(JSON, default=list)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="journal_entries")
    session = relationship("YogaSession", back_populates="journal")


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    item_type = Column(String(50), nullable=False)  # pose, routine, article, pranayama
    item_id = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    subtitle = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="favorites")


class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    time_of_day = Column(String(20), default="07:00 AM")
    days_of_week = Column(JSON, default=lambda: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    is_enabled = Column(Boolean, default=True)
    label = Column(String(100), default="Daily Yoga Practice")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="reminders")
