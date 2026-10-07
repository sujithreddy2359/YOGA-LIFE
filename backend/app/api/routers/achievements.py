from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.journey import Achievement, UserAchievement
from app.models.practice import YogaSession, Streak
from app.schemas.journey import AchievementOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/achievements", tags=["Achievements & Badges"])

@router.get("", response_model=List[AchievementOut])
def get_achievements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    all_achievements = db.query(Achievement).all()
    user_ach_map = {
        ua.achievement_id: ua.unlocked_at
        for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()
    }

    # Compute progress stats for current user
    all_sessions = db.query(YogaSession).filter(
        YogaSession.user_id == current_user.id,
        YogaSession.status == "completed"
    ).all()
    total_sessions = len(all_sessions)
    total_minutes = sum(int((s.duration_seconds or 0) / 60) for s in all_sessions)
    
    streak = db.query(Streak).filter(Streak.user_id == current_user.id).first()
    cur_streak = streak.current_streak if streak else 0
    unique_days = streak.total_practice_days if streak else 0

    out = []
    for ach in all_achievements:
        is_unlocked = ach.id in user_ach_map
        unlocked_at = user_ach_map.get(ach.id)

        # Calculate live progress value
        cur_val = 0
        if ach.criteria_type == "sessions_count":
            cur_val = total_sessions
        elif ach.criteria_type == "total_minutes":
            cur_val = total_minutes
        elif ach.criteria_type == "streak_days":
            cur_val = cur_streak
        elif ach.criteria_type == "unique_days":
            cur_val = unique_days
        elif ach.criteria_type == "pose_diversity":
            cur_val = min(total_sessions, ach.threshold_value)

        progress_pct = min(100.0, round((cur_val / ach.threshold_value) * 100.0, 1)) if ach.threshold_value > 0 else 100.0
        if is_unlocked:
            progress_pct = 100.0
            cur_val = max(cur_val, ach.threshold_value)

        out.append(AchievementOut(
            id=ach.id,
            code=ach.code,
            title=ach.title,
            description=ach.description,
            icon=ach.icon,
            emoji=ach.emoji,
            category=ach.category,
            criteria_type=ach.criteria_type,
            threshold_value=ach.threshold_value,
            badge_color=ach.badge_color,
            is_unlocked=is_unlocked,
            unlocked_at=unlocked_at,
            progress_value=cur_val,
            progress_percentage=progress_pct
        ))

    return out
