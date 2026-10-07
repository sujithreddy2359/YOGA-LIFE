from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.core.database import Base

class JourneyMilestone(Base):
    __tablename__ = "journey_milestones"

    id = Column(Integer, primary_key=True, index=True)
    day_number = Column(Integer, unique=True, index=True, nullable=False)  # 1, 7, 14, 30
    title = Column(String(255), nullable=False)  # Beginner, Consistency Badge, Flexibility Journey, Yoga Life Champion
    subtitle = Column(String(255), nullable=True)
    badge_code = Column(String(100), unique=True, nullable=False)
    badge_icon = Column(String(50), default="Award")
    badge_emoji = Column(String(10), default="🌱")
    description = Column(Text, nullable=False)
    required_practice_days = Column(Integer, nullable=False)  # 1, 7, 14, 30
    unlock_reward_title = Column(String(255), nullable=True)
    unlock_reward_description = Column(Text, nullable=True)
    order_index = Column(Integer, default=1)


class JourneyProgress(Base):
    __tablename__ = "journey_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    milestone_id = Column(Integer, ForeignKey("journey_milestones.id"), nullable=False)
    is_unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)
    completed_practice_days_snapshot = Column(Integer, default=0)

    user = relationship("User", back_populates="journey_progress")
    milestone = relationship("JourneyMilestone")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="Sparkles")
    emoji = Column(String(10), default="✨")
    category = Column(String(50), default="milestone")  # practice, streak, duration, diversity, mastery
    criteria_type = Column(String(50), nullable=False)  # sessions_count, total_minutes, streak_days, unique_days, pose_diversity
    threshold_value = Column(Integer, nullable=False)
    badge_color = Column(String(50), default="emerald")


class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement")
