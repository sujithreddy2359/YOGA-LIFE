from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.user import User, Profile, UserSession
from app.models.practice import YogaSession, PracticeHistory, Streak
from app.schemas.dashboard import DashboardSummaryOut, TodayStats, WeeklyStats, DayPracticeData
from app.api.deps import get_current_user
from app.services.journey_engine import get_user_journey_summary
from app.services.recommendation_engine import generate_personalized_recommendation

router = APIRouter(prefix="/dashboard", tags=["Dashboard & Analytics"])

@router.get("/summary", response_model=DashboardSummaryOut)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    hour = now.hour
    if hour < 12:
        greeting = "Good Morning"
    elif hour < 17:
        greeting = "Good Afternoon"
    else:
        greeting = "Good Evening"

    # Today's stats
    start_of_today = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
    today_sessions = db.query(YogaSession).filter(
        YogaSession.user_id == current_user.id,
        YogaSession.status == "completed",
        YogaSession.completed_at >= start_of_today
    ).all()

    today_minutes = sum(int((s.duration_seconds or 0) / 60) for s in today_sessions)
    today_poses_count = sum(len(s.poses) for s in today_sessions)
    today_stats = TodayStats(
        total_minutes=today_minutes,
        sessions_count=len(today_sessions),
        poses_count=today_poses_count
    )

    # Streak & Journey
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    cur_streak = streak.current_streak if streak else 0
    lng_streak = streak.longest_streak if streak else 0

    journey_summary = get_user_journey_summary(db, current_user.id)

    # Weekly minutes
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week_dt = datetime(start_of_week.year, start_of_week.month, start_of_week.day, tzinfo=timezone.utc)
    
    weekly_sessions = db.query(YogaSession).filter(
        YogaSession.user_id == current_user.id,
        YogaSession.status == "completed",
        YogaSession.completed_at >= start_of_week_dt
    ).all()
    cur_weekly_minutes = sum(int((s.duration_seconds or 0) / 60) for s in weekly_sessions)

    # Recommended Routine
    rec = generate_personalized_recommendation(db, current_user.id)

    # Recent activity logs (from UserSession / Practice)
    recent_activity = []
    user_sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id
    ).order_by(UserSession.login_time.desc()).limit(3).all()

    for us in user_sessions:
        login_dt = us.login_time or now
        time_str = login_dt.strftime("%I:%M %p")
        if login_dt.date() == now.date():
            day_label = "Today"
        elif login_dt.date() == (now.date() - timedelta(days=1)):
            day_label = "Yesterday"
        else:
            day_label = login_dt.strftime("%b %d")
        
        recent_activity.append({
            "day": day_label,
            "time": time_str,
            "text": f"Logged in at {time_str}"
        })

    is_onboarded = current_user.profile.is_onboarded if current_user.profile else False

    return {
        "full_name": current_user.full_name,
        "greeting": greeting,
        "today_stats": today_stats,
        "current_streak": cur_streak,
        "longest_streak": lng_streak,
        "current_journey_day": journey_summary["current_milestone_day"],
        "next_milestone_day": journey_summary["next_milestone_day"],
        "days_to_next_milestone": journey_summary["days_to_next_milestone"],
        "weekly_goal_minutes": 150,
        "current_weekly_minutes": cur_weekly_minutes,
        "recommended_routine": rec,
        "recent_activity": recent_activity,
        "has_onboarded": is_onboarded
    }

@router.get("/graph")
def get_practice_graph_data(
    range_type: str = "week",  # week, month, all
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    days_count = 7 if range_type == "week" else 30
    
    data = []
    day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    for i in range(days_count - 1, -1, -1):
        target_date = (now - timedelta(days=i)).date()
        start_dt = datetime(target_date.year, target_date.month, target_date.day, 0, 0, 0, tzinfo=timezone.utc)
        end_dt = datetime(target_date.year, target_date.month, target_date.day, 23, 59, 59, tzinfo=timezone.utc)

        sessions = db.query(YogaSession).filter(
            YogaSession.user_id == current_user.id,
            YogaSession.status == "completed",
            YogaSession.completed_at >= start_dt,
            YogaSession.completed_at <= end_dt
        ).all()

        total_min = sum(round((s.duration_seconds or 0) / 60.0, 1) for s in sessions)
        data.append({
            "date": target_date.strftime("%Y-%m-%d"),
            "display_label": target_date.strftime("%a") if days_count == 7 else target_date.strftime("%b %d"),
            "minutes": total_min,
            "sessions": len(sessions)
        })

    # Summary metrics
    all_completed = db.query(YogaSession).filter(
        YogaSession.user_id == current_user.id,
        YogaSession.status == "completed"
    ).all()

    total_sec = sum(s.duration_seconds or 0 for s in all_completed)
    total_hours = round(total_sec / 3600.0, 1)
    avg_duration = round((total_sec / len(all_completed) / 60.0), 1) if all_completed else 0.0

    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    total_days = streak.total_practice_days if streak else 0

    return {
        "chart_data": data,
        "total_hours": total_hours,
        "average_session_minutes": avg_duration,
        "total_sessions": len(all_completed),
        "total_practice_days": total_days,
        "most_practiced_yoga_type": "Hatha Yoga",
        "most_practiced_pose": "Tree Pose"
    }

@router.get("/weekly")
def get_weekly_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week_dt = datetime(start_of_week.year, start_of_week.month, start_of_week.day, tzinfo=timezone.utc)

    weekly_sessions = db.query(YogaSession).filter(
        YogaSession.user_id == current_user.id,
        YogaSession.status == "completed",
        YogaSession.completed_at >= start_of_week_dt
    ).all()

    unique_days = set(s.completed_at.date() for s in weekly_sessions if s.completed_at)
    total_minutes = sum(int((s.duration_seconds or 0) / 60) for s in weekly_sessions)
    avg_minutes = round(total_minutes / len(weekly_sessions), 1) if weekly_sessions else 0
    longest_min = max([int((s.duration_seconds or 0) / 60) for s in weekly_sessions] or [0])

    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    cur_streak = streak.current_streak if streak else 0

    return {
        "days_practiced": len(unique_days),
        "total_minutes": total_minutes,
        "average_minutes": avg_minutes,
        "longest_session_minutes": longest_min,
        "most_practiced": "Flexibility & Posture Flow",
        "current_streak": cur_streak,
        "encouraging_feedback": f"You showed up {len(unique_days)} days this week! Your nervous system thrives on steady, calm rhythm."
    }
