from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ProfileBase(BaseModel):
    avatar_url: Optional[str] = None
    primary_goal: Optional[str] = "General Wellness"
    experience_level: Optional[str] = "Beginner"
    preferred_duration_minutes: Optional[int] = 15
    preferred_time_of_day: Optional[str] = "Morning"
    bio: Optional[str] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileOut(ProfileBase):
    id: int
    is_onboarded: bool
    total_practice_seconds: int
    total_sessions_completed: int
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone_number: Optional[str]
    is_active: bool
    is_admin: bool
    created_at: datetime
    profile: Optional[ProfileOut]

    class Config:
        from_attributes = True

class OnboardingSubmit(BaseModel):
    primary_goal: str  # Relaxation, Focus, Flexibility, Strength, Better Sleep, Energy, General Wellness
    experience_level: str  # Beginner, Intermediate, Advanced
    preferred_duration_minutes: int  # 5, 10, 15, 30, 45, 60
    preferred_time_of_day: str  # Morning, Afternoon, Evening, Custom time
