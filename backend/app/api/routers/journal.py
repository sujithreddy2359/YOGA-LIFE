from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.journal import JournalEntry, Reminder
from app.schemas.journal import JournalEntryCreate, JournalEntryOut, ReminderCreate, ReminderOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/journal", tags=["Yoga Journal & Reminders"])

@router.get("", response_model=List[JournalEntryOut])
def get_journal_entries(
    limit: int = Query(30, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).order_by(JournalEntry.entry_date.desc()).limit(limit).all()

@router.post("", response_model=JournalEntryOut)
def create_journal_entry(
    data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    entry = JournalEntry(
        user_id=current_user.id,
        session_id=data.session_id,
        entry_date=datetime.now(timezone.utc),
        mood=data.mood,
        energy_level=data.energy_level,
        practice_duration_minutes=data.practice_duration_minutes or 0,
        reflection_text=data.reflection_text,
        tags=data.tags or []
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

# Reminders Endpoints
@router.get("/reminders", response_model=List[ReminderOut])
def get_reminders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Reminder).filter(Reminder.user_id == current_user.id).all()

@router.post("/reminders", response_model=ReminderOut)
def create_or_update_reminder(
    data: ReminderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Reminder).filter(Reminder.user_id == current_user.id).first()
    if existing:
        existing.time_of_day = data.time_of_day
        existing.days_of_week = data.days_of_week
        existing.is_enabled = data.is_enabled
        existing.label = data.label or "Daily Yoga Practice"
        db.commit()
        db.refresh(existing)
        return existing

    rem = Reminder(
        user_id=current_user.id,
        time_of_day=data.time_of_day,
        days_of_week=data.days_of_week,
        is_enabled=data.is_enabled,
        label=data.label or "Daily Yoga Practice"
    )
    db.add(rem)
    db.commit()
    db.refresh(rem)
    return rem
