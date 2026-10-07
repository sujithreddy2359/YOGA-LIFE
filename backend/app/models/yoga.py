from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class YogaCategory(Base):
    __tablename__ = "yoga_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="Sparkles")
    image_url = Column(String(500), nullable=True)
    difficulty = Column(String(50), default="All Levels")
    typical_duration = Column(String(50), default="15-45 mins")
    purpose = Column(String(255), nullable=True)


class YogaPose(Base):
    __tablename__ = "yoga_poses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)  # e.g., Tree Pose
    sanskrit_name = Column(String(255), nullable=True)  # e.g., Vrikshasana
    slug = Column(String(255), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True, nullable=False)  # Standing, Sitting, Balancing, Backbend, Twisting, Restorative
    difficulty = Column(String(50), index=True, default="Beginner")  # Beginner, Intermediate, Advanced
    image_url = Column(String(500), nullable=True)
    illustration_svg = Column(Text, nullable=True)
    model_3d_type = Column(String(50), default="avatar_tree")  # Identifier for 3D procedural pose animation / GLTF
    description = Column(Text, nullable=False)
    instructions = Column(JSON, nullable=False)  # List of step strings
    benefits = Column(JSON, nullable=False)  # List of benefit strings
    precautions = Column(JSON, nullable=False)  # List of safety/contraindication strings
    breathing_cues = Column(Text, nullable=False)  # Breathing instructions
    recommended_duration_sec = Column(Integer, default=30)
    has_sides = Column(Integer, default=1)  # 1: single side / neutral, 2: left & right side
    body_target = Column(String(100), index=True, default="Full Body")  # Shoulders, Spine, Core, Legs, Hips, Full Body
    tags = Column(JSON, default=list)  # ["Flexibility", "Balance", "Morning", "Calm"]
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class CustomRoutine(Base):
    __tablename__ = "custom_routines"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default="Custom")
    difficulty = Column(String(50), default="Beginner")
    poses_json = Column(JSON, nullable=False)  # List of {pose_id, name, duration_sec, rest_sec, side}
    total_duration_sec = Column(Integer, default=300)
    is_public = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
