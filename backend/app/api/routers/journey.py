from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.journey import JourneyProgressSummary
from app.api.deps import get_current_user
from app.models.user import User
from app.services.journey_engine import get_user_journey_summary, update_streak_and_journey_on_practice

router = APIRouter(prefix="/journey", tags=["Yoga Journey"])

@router.get("/progress", response_model=JourneyProgressSummary)
def get_journey_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_user_journey_summary(db, current_user.id)

@router.post("/check")
def check_journey_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    streak, new_milestones, new_achievements = update_streak_and_journey_on_practice(db, current_user.id)
    summary = get_user_journey_summary(db, current_user.id)
    return {
        "summary": summary,
        "newly_unlocked_milestones": [m.title for m in new_milestones],
        "newly_unlocked_achievements": [a.title for a in new_achievements]
    }
