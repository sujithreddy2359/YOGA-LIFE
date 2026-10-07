from datetime import datetime, date, timedelta, timezone
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User, Profile
from app.models.practice import YogaSession, PracticeHistory, Streak
from app.models.journey import JourneyMilestone, JourneyProgress, Achievement, UserAchievement

def update_streak_and_journey_on_practice(db: Session, user_id: int) -> Tuple[Streak, List[JourneyMilestone], List[Achievement]]:
    """
    Computes accurate streak, unique calendar practice days,
    unlocks new Journey Milestones (Day 1, 7, 14, 30),
    and checks all Achievement criteria.
    """
    now = datetime.now(timezone.utc)
    today_date = now.date()

    # 1. Fetch or create streak record
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    if not streak:
        streak = Streak(user_id=user_id, current_streak=0, longest_streak=0, total_practice_days=0)
        db.add(streak)
        db.flush()

    # 2. Get distinct practice dates for this user
    all_sessions = db.query(YogaSession).filter(
        YogaSession.user_id == user_id,
        YogaSession.status == "completed"
    ).all()

    practice_dates = set()
    total_practice_seconds = 0
    total_sessions_count = len(all_sessions)

    for s in all_sessions:
        if s.completed_at:
            practice_dates.add(s.completed_at.date())
        elif s.started_at:
            practice_dates.add(s.started_at.date())
        total_practice_seconds += s.duration_seconds or 0

    unique_days_count = len(practice_dates)
    total_minutes = int(total_practice_seconds / 60)

    # Calculate streak accurately
    sorted_dates = sorted(list(practice_dates), reverse=True)
    current_streak = 0
    if sorted_dates:
        # Check if user practiced today or yesterday
        most_recent = sorted_dates[0]
        if most_recent == today_date or most_recent == (today_date - timedelta(days=1)):
            current_streak = 1
            check_date = most_recent - timedelta(days=1)
            for d in sorted_dates[1:]:
                if d == check_date:
                    current_streak += 1
                    check_date -= timedelta(days=1)
                else:
                    break

    streak.current_streak = current_streak
    streak.longest_streak = max(streak.longest_streak, current_streak)
    streak.total_practice_days = unique_days_count
    streak.last_practice_date = now
    db.commit()

    # Update User Profile totals
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if profile:
        profile.total_practice_seconds = total_practice_seconds
        profile.total_sessions_completed = total_sessions_count
        db.commit()

    # 3. Check and unlock Journey Milestones
    newly_unlocked_milestones = []
    milestones = db.query(JourneyMilestone).order_by(JourneyMilestone.day_number.asc()).all()

    for m in milestones:
        # Check if milestone is already unlocked
        progress = db.query(JourneyProgress).filter(
            JourneyProgress.user_id == user_id,
            JourneyProgress.milestone_id == m.id
        ).first()

        if unique_days_count >= m.required_practice_days:
            if not progress:
                progress = JourneyProgress(
                    user_id=user_id,
                    milestone_id=m.id,
                    is_unlocked=True,
                    unlocked_at=now,
                    completed_practice_days_snapshot=unique_days_count
                )
                db.add(progress)
                newly_unlocked_milestones.append(m)
            elif not progress.is_unlocked:
                progress.is_unlocked = True
                progress.unlocked_at = now
                newly_unlocked_milestones.append(m)
    db.commit()

    # 4. Check and award Achievements
    newly_unlocked_achievements = []
    achievements = db.query(Achievement).all()
    user_ach_ids = set(
        row[0] for row in db.query(UserAchievement.achievement_id).filter(UserAchievement.user_id == user_id).all()
    )

    for ach in achievements:
        if ach.id in user_ach_ids:
            continue

        unlocked = False
        if ach.criteria_type == "sessions_count" and total_sessions_count >= ach.threshold_value:
            unlocked = True
        elif ach.criteria_type == "total_minutes" and total_minutes >= ach.threshold_value:
            unlocked = True
        elif ach.criteria_type == "streak_days" and current_streak >= ach.threshold_value:
            unlocked = True
        elif ach.criteria_type == "unique_days" and unique_days_count >= ach.threshold_value:
            unlocked = True
        elif ach.criteria_type == "pose_diversity" and total_sessions_count >= 3:
            unlocked = True

        if unlocked:
            user_ach = UserAchievement(
                user_id=user_id,
                achievement_id=ach.id,
                unlocked_at=now
            )
            db.add(user_ach)
            newly_unlocked_achievements.append(ach)
    db.commit()

    return streak, newly_unlocked_milestones, newly_unlocked_achievements


def get_user_journey_summary(db: Session, user_id: int) -> Dict[str, Any]:
    streak = db.query(Streak).filter(Streak.user_id == user_id).first()
    unique_days = streak.total_practice_days if streak else 0

    milestones = db.query(JourneyMilestone).order_by(JourneyMilestone.day_number.asc()).all()
    user_progress_rows = {
        p.milestone_id: p for p in db.query(JourneyProgress).filter(JourneyProgress.user_id == user_id).all()
    }

    milestone_outs = []
    current_milestone_day = 1
    next_milestone_day = 7
    days_to_next = 7 - unique_days if unique_days < 7 else 0

    for m in milestones:
        p = user_progress_rows.get(m.id)
        is_unlocked = (p.is_unlocked if p else False) or (unique_days >= m.required_practice_days)
        unlocked_at = p.unlocked_at if p else None

        milestone_outs.append({
            "id": m.id,
            "day_number": m.day_number,
            "title": m.title,
            "subtitle": m.subtitle,
            "badge_code": m.badge_code,
            "badge_icon": m.badge_icon,
            "badge_emoji": m.badge_emoji,
            "description": m.description,
            "required_practice_days": m.required_practice_days,
            "unlock_reward_title": m.unlock_reward_title,
            "unlock_reward_description": m.unlock_reward_description,
            "order_index": m.order_index,
            "is_unlocked": is_unlocked,
            "unlocked_at": unlocked_at
        })

    # Determine current milestone level & next goal
    if unique_days < 1:
        current_milestone_day = 0
        next_milestone_day = 1
        days_to_next = 1
    elif unique_days < 7:
        current_milestone_day = 1
        next_milestone_day = 7
        days_to_next = 7 - unique_days
    elif unique_days < 14:
        current_milestone_day = 7
        next_milestone_day = 14
        days_to_next = 14 - unique_days
    elif unique_days < 30:
        current_milestone_day = 14
        next_milestone_day = 30
        days_to_next = 30 - unique_days
    else:
        current_milestone_day = 30
        next_milestone_day = 30
        days_to_next = 0

    # Calculate overall progress percentage towards 30 days
    progress_percentage = min(100.0, round((unique_days / 30.0) * 100.0, 1))

    return {
        "current_practice_days": unique_days,
        "current_milestone_day": current_milestone_day,
        "next_milestone_day": next_milestone_day,
        "days_to_next_milestone": max(0, days_to_next),
        "progress_percentage": progress_percentage,
        "milestones": milestone_outs,
        "unlocked_milestones_count": sum(1 for m in milestone_outs if m["is_unlocked"])
    }
