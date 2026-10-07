from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TodayStats(BaseModel):
    total_minutes: int = 0
    sessions_count: int = 0
    poses_count: int = 0

class WeeklyStats(BaseModel):
    weekly_goal_minutes: int = 150
    current_weekly_minutes: int = 0
    days_practiced_this_week: int = 0
    average_session_minutes: float = 0.0
    longest_session_minutes: int = 0
    most_practiced_category: str = "General"
    encouraging_feedback: str = "Keep up the wonderful flow."

class DayPracticeData(BaseModel):
    date: str
    day_name: str
    minutes: float
    sessions_count: int

class RecommendedRoutine(BaseModel):
    id: str
    title: str
    subtitle: str
    duration_minutes: int
    difficulty: str
    poses_count: int
    category: str
    reason: str
    poses: List[Dict[str, Any]] = []

class DashboardSummaryOut(BaseModel):
    full_name: str
    greeting: str
    today_stats: TodayStats
    current_streak: int
    longest_streak: int
    current_journey_day: int
    next_milestone_day: int
    days_to_next_milestone: int
    weekly_goal_minutes: int
    current_weekly_minutes: int
    recommended_routine: RecommendedRoutine
    recent_activity: List[Dict[str, Any]] = []
    has_onboarded: bool = True
