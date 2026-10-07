from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class YogaCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: str
    icon: Optional[str]
    image_url: Optional[str]
    difficulty: Optional[str]
    typical_duration: Optional[str]
    purpose: Optional[str]

    class Config:
        from_attributes = True

class YogaPoseBase(BaseModel):
    name: str
    sanskrit_name: Optional[str] = None
    slug: str
    category: str
    difficulty: str
    image_url: Optional[str] = None
    illustration_svg: Optional[str] = None
    model_3d_type: Optional[str] = "avatar_tree"
    description: str
    instructions: List[str]
    benefits: List[str]
    precautions: List[str]
    breathing_cues: str
    recommended_duration_sec: int = 30
    has_sides: int = 1
    body_target: str = "Full Body"
    tags: List[str] = []

class YogaPoseCreate(YogaPoseBase):
    pass

class YogaPoseOut(YogaPoseBase):
    id: int
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

class RoutinePoseItem(BaseModel):
    pose_id: Optional[int] = None
    name: str
    sanskrit_name: Optional[str] = None
    duration_sec: int = 30
    rest_sec: int = 10
    side: Optional[str] = "both"  # left, right, both
    image_url: Optional[str] = None
    breathing_cues: Optional[str] = None

class CustomRoutineCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "Custom"
    difficulty: Optional[str] = "Beginner"
    poses: List[RoutinePoseItem]
    is_public: Optional[int] = 0

class CustomRoutineOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    category: str
    difficulty: str
    poses_json: List[dict]
    total_duration_sec: int
    is_public: int
    created_at: datetime

    class Config:
        from_attributes = True
