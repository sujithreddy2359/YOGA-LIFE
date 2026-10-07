from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JournalEntryCreate(BaseModel):
    session_id: Optional[int] = None
    mood: Optional[str] = "Relaxed"
    energy_level: Optional[int] = 8
    practice_duration_minutes: Optional[int] = 15
    reflection_text: str
    tags: Optional[List[str]] = []

class JournalEntryOut(BaseModel):
    id: int
    user_id: int
    session_id: Optional[int]
    entry_date: datetime
    mood: Optional[str]
    energy_level: Optional[int]
    practice_duration_minutes: int
    reflection_text: str
    tags: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class FavoriteCreate(BaseModel):
    item_type: str  # pose, routine, article, pranayama
    item_id: int
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None

class FavoriteOut(BaseModel):
    id: int
    user_id: int
    item_type: str
    item_id: int
    title: Optional[str]
    subtitle: Optional[str]
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ReminderCreate(BaseModel):
    time_of_day: str = "07:00 AM"
    days_of_week: List[str] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    is_enabled: bool = True
    label: Optional[str] = "Daily Yoga Practice"

class ReminderOut(ReminderCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
