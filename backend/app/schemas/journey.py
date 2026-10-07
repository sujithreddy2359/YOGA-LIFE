from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class JourneyMilestoneOut(BaseModel):
    id: int
    day_number: int
    title: str
    subtitle: Optional[str]
    badge_code: str
    badge_icon: str
    badge_emoji: str
    description: str
    required_practice_days: int
    unlock_reward_title: Optional[str]
    unlock_reward_description: Optional[str]
    order_index: int
    is_unlocked: bool = False
    unlocked_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JourneyProgressSummary(BaseModel):
    current_practice_days: int
    current_milestone_day: int
    next_milestone_day: int
    days_to_next_milestone: int
    progress_percentage: float
    milestones: List[JourneyMilestoneOut]
    unlocked_milestones_count: int

class AchievementOut(BaseModel):
    id: int
    code: str
    title: str
    description: str
    icon: str
    emoji: str
    category: str
    criteria_type: str
    threshold_value: int
    badge_color: str
    is_unlocked: bool = False
    unlocked_at: Optional[datetime] = None
    progress_value: int = 0
    progress_percentage: float = 0.0

    class Config:
        from_attributes = True
