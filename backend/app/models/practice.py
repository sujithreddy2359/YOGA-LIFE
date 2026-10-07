from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class YogaSession(Base):
    __tablename__ = "yoga_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    routine_name = Column(String(255), nullable=False)
    yoga_type = Column(String(100), default="Hatha Yoga")
    duration_seconds = Column(Integer, default=0)
    completion_percentage = Column(Float, default=100.0)
    status = Column(String(50), default="completed")  # completed, abandoned, paused
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    mood = Column(String(50), nullable=True)  # Great, Good, Relaxed, Okay, Tired
    energy_level = Column(Integer, nullable=True)  # 1 to 10
    notes = Column(Text, nullable=True)

    user = relationship("User", back_populates="yoga_sessions")
    poses = relationship("SessionPose", back_populates="session", cascade="all, delete-orphan")
    history = relationship("PracticeHistory", back_populates="session", uselist=False, cascade="all, delete-orphan")
    journal = relationship("JournalEntry", back_populates="session", uselist=False)


class SessionPose(Base):
    __tablename__ = "session_poses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("yoga_sessions.id", ondelete="CASCADE"), nullable=False)
    pose_id = Column(Integer, nullable=True)
    pose_name = Column(String(255), nullable=False)
    duration_seconds = Column(Integer, default=30)
    side = Column(String(20), default="both")  # left, right, both
    order_index = Column(Integer, default=0)

    session = relationship("YogaSession", back_populates="poses")


class PracticeHistory(Base):
    __tablename__ = "practice_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    session_id = Column(Integer, ForeignKey("yoga_sessions.id", ondelete="CASCADE"), nullable=False)
    practice_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    duration_minutes = Column(Float, default=0.0)
    yoga_type = Column(String(100), default="Hatha Yoga")
    poses_count = Column(Integer, default=1)
    completion_rate = Column(Float, default=100.0)

    session = relationship("YogaSession", back_populates="history")


class Streak(Base):
    __tablename__ = "streaks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    total_practice_days = Column(Integer, default=0)
    last_practice_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="streak")
