from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SessionPoseInput(BaseModel):
    pose_id: Optional[int] = None
    pose_name: str
    duration_seconds: int = 30
    side: Optional[str] = "both"
    order_index: int = 0

class PracticeStartRequest(BaseModel):
    routine_name: str
    yoga_type: Optional[str] = "Hatha Yoga"
    poses: List[SessionPoseInput]

class PracticeCompleteRequest(BaseModel):
    session_id: int
    duration_seconds: int
    completion_percentage: float = 100.0
    status: str = "completed"
    mood: Optional[str] = None  # Great, Good, Relaxed, Okay, Tired
    energy_level: Optional[int] = None  # 1 to 10
    notes: Optional[str] = None

class SessionPoseOut(BaseModel):
    id: int
    pose_id: Optional[int]
    pose_name: str
    duration_seconds: int
    side: str
    order_index: int

    class Config:
        from_attributes = True

class YogaSessionOut(BaseModel):
    id: int
    user_id: int
    routine_name: str
    yoga_type: str
    duration_seconds: int
    completion_percentage: float
    status: str
    started_at: datetime
    completed_at: datetime
    mood: Optional[str]
    energy_level: Optional[int]
    notes: Optional[str]
    poses: List[SessionPoseOut] = []

    class Config:
        from_attributes = True

class PracticeHistoryOut(BaseModel):
    id: int
    session_id: int
    practice_date: datetime
    duration_minutes: float
    yoga_type: str
    poses_count: int
    completion_rate: float
    routine_name: Optional[str] = None
    mood: Optional[str] = None

    class Config:
        from_attributes = True

class StreakOut(BaseModel):
    current_streak: int
    longest_streak: int
    total_practice_days: int
    last_practice_date: Optional[datetime]

    class Config:
        from_attributes = True
