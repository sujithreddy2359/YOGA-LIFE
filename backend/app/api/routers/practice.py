from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.practice import YogaSession, SessionPose, PracticeHistory, Streak
from app.models.journal import JournalEntry
from app.schemas.practice import (
    PracticeStartRequest, PracticeCompleteRequest, YogaSessionOut, PracticeHistoryOut, StreakOut
)
from app.api.deps import get_current_user
from app.models.user import User
from app.services.journey_engine import update_streak_and_journey_on_practice

router = APIRouter(prefix="/practice", tags=["Guided Practice"])

@router.post("/start", response_model=YogaSessionOut)
def start_practice_session(
    data: PracticeStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = YogaSession(
        user_id=current_user.id,
        routine_name=data.routine_name,
        yoga_type=data.yoga_type or "Hatha Yoga",
        status="in_progress",
        started_at=datetime.now(timezone.utc)
    )
    db.add(session)
    db.flush()

    for idx, p in enumerate(data.poses):
        pose_entry = SessionPose(
            session_id=session.id,
            pose_id=p.pose_id,
            pose_name=p.pose_name,
            duration_seconds=p.duration_seconds,
            side=p.side or "both",
            order_index=idx
        )
        db.add(pose_entry)

    db.commit()
    db.refresh(session)
    return session

@router.post("/complete")
def complete_practice_session(
    data: PracticeCompleteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session = db.query(YogaSession).filter(
        YogaSession.id == data.session_id,
        YogaSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Practice session not found")

    now = datetime.now(timezone.utc)
    session.duration_seconds = data.duration_seconds
    session.completion_percentage = data.completion_percentage
    session.status = data.status or "completed"
    session.completed_at = now
    session.mood = data.mood
    session.energy_level = data.energy_level
    session.notes = data.notes

    # Add to PracticeHistory table
    poses_count = len(session.poses) if session.poses else 1
    duration_mins = round(data.duration_seconds / 60.0, 1)

    history = PracticeHistory(
        user_id=current_user.id,
        session_id=session.id,
        practice_date=now,
        duration_minutes=duration_mins,
        yoga_type=session.yoga_type,
        poses_count=poses_count,
        completion_rate=data.completion_percentage
    )
    db.add(history)

    # Save to Journal if notes or mood provided
    if data.notes or data.mood:
        journal_entry = JournalEntry(
            user_id=current_user.id,
            session_id=session.id,
            entry_date=now,
            mood=data.mood,
            energy_level=data.energy_level or 8,
            practice_duration_minutes=int(duration_mins),
            reflection_text=data.notes or f"Completed {session.routine_name} feeling {data.mood or 'refreshed'}.",
            tags=[session.yoga_type, data.mood or "Refreshed"]
        )
        db.add(journal_entry)

    db.commit()

    # Recalculate streak, journey milestones, and achievements
    streak, new_milestones, new_achievements = update_streak_and_journey_on_practice(db, current_user.id)

    return {
        "message": "Practice session saved successfully",
        "session_id": session.id,
        "duration_minutes": duration_mins,
        "current_streak": streak.current_streak,
        "total_practice_days": streak.total_practice_days,
        "newly_unlocked_milestones": [
            {
                "day_number": m.day_number,
                "title": m.title,
                "badge_emoji": m.badge_emoji,
                "badge_code": m.badge_code
            }
            for m in new_milestones
        ],
        "newly_unlocked_achievements": [
            {
                "title": a.title,
                "emoji": a.emoji,
                "description": a.description
            }
            for a in new_achievements
        ]
    }

@router.get("/history", response_model=List[PracticeHistoryOut])
def get_practice_history(
    limit: int = Query(30, ge=1, le=100),
    timeframe: Optional[str] = Query(None, description="today, yesterday, week, month"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(PracticeHistory).filter(PracticeHistory.user_id == current_user.id)
    now = datetime.now(timezone.utc)

    if timeframe == "today":
        start_of_day = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        query = query.filter(PracticeHistory.practice_date >= start_of_day)
    elif timeframe == "week":
        start_of_week = now - (now.weekday() * 86400)
        query = query.filter(PracticeHistory.practice_date >= start_of_week)

    history_records = query.order_by(PracticeHistory.practice_date.desc()).limit(limit).all()
    
    out = []
    for h in history_records:
        session = db.query(YogaSession).filter(YogaSession.id == h.session_id).first()
        out.append(PracticeHistoryOut(
            id=h.id,
            session_id=h.session_id,
            practice_date=h.practice_date,
            duration_minutes=h.duration_minutes,
            yoga_type=h.yoga_type,
            poses_count=h.poses_count,
            completion_rate=h.completion_rate,
            routine_name=session.routine_name if session else "Mindful Flow",
            mood=session.mood if session else None
        ))
    return out

@router.get("/streak", response_model=StreakOut)
def get_user_streak(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    if not streak:
        streak = Streak(user_id=current_user.id, current_streak=0, longest_streak=0, total_practice_days=0)
        db.add(streak)
        db.commit()
    return streak
