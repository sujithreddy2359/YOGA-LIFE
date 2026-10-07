from datetime import datetime, timezone
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.user import Profile
from app.models.yoga import YogaPose
from app.models.practice import YogaSession

def generate_personalized_recommendation(db: Session, user_id: int) -> Dict[str, Any]:
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    goal = profile.primary_goal if profile else "General Wellness"
    duration = profile.preferred_duration_minutes if profile else 15
    experience = profile.experience_level if profile else "Beginner"

    # Inspect last completed session for variety
    last_session = db.query(YogaSession).filter(
        YogaSession.user_id == user_id,
        YogaSession.status == "completed"
    ).order_by(YogaSession.completed_at.desc()).first()

    last_type = last_session.yoga_type if last_session else ""

    # Determine recommended routine theme
    if goal == "Relaxation" or "sleep" in goal.lower():
        title = "🌿 Evening Surrender & Rest"
        subtitle = "Restorative asanas to slow heart rate and melt muscular tension"
        category = "Restorative"
        reason = "Tailored for deep relaxation and mental tranquility"
        target_tags = ["Relaxation", "Calm", "Better Sleep", "Stress Relief"]
    elif goal == "Flexibility":
        title = "🤸 Full Body Mobility & Lengthening"
        subtitle = "Gentle progressive openers for hamstrings, hips, and shoulders"
        category = "Flexibility"
        reason = "Designed to increase range of motion and joint mobility"
        target_tags = ["Flexibility", "Mobility", "Hips", "Spine"]
    elif goal == "Strength":
        title = "⚡ Dynamic Power & Core Awakening"
        subtitle = "Postures to build foundational stability, stamina, and heat"
        category = "Strength"
        reason = "Selected to activate deep core, thighs, and posterior chain"
        target_tags = ["Strength", "Core", "Legs", "Focus"]
    elif goal == "Focus":
        title = "🧠 Centered Mind & Balance Flow"
        subtitle = "Single-pointed balance postures that train unwavering focus"
        category = "Balance"
        reason = "Cultivates mental clarity and neuro-muscular balance"
        target_tags = ["Balance", "Focus", "Morning"]
    else:
        # If practiced flexibility last time, offer relaxation or energy today
        if "Flexibility" in last_type:
            title = "🌿 Gentle Mindful Rebalance"
            subtitle = "Soothes the nervous system after yesterday's mobility work"
            category = "Restorative"
            reason = "Because you practiced mobility recently, today balances recovery"
            target_tags = ["Relaxation", "Calm"]
        else:
            title = "☀️ Morning Vitality Flow"
            subtitle = "Awaken the spine, oxygenate lungs, and start your day centered"
            category = "Hatha Yoga"
            reason = "Harmonious balance of gentle awakening and grounding"
            target_tags = ["Full Body", "Energy", "Morning"]

    # Query matching poses from database
    all_poses = db.query(YogaPose).all()
    matching_poses = []
    for pose in all_poses:
        # Check tag intersection or body target match
        has_tag = any(t in (pose.tags or []) for t in target_tags)
        is_appropriate_diff = (experience == "Advanced") or (pose.difficulty != "Advanced")
        if has_tag and is_appropriate_diff:
            matching_poses.append(pose)

    if not matching_poses:
        matching_poses = all_poses[:5]

    # Pick 4 to 6 poses
    selected_poses = matching_poses[:6]
    routine_poses = [
        {
            "pose_id": p.id,
            "name": p.name,
            "sanskrit_name": p.sanskrit_name,
            "duration_sec": p.recommended_duration_sec or 30,
            "rest_sec": 10,
            "side": "both" if (p.has_sides or 1) > 1 else "both",
            "image_url": p.image_url,
            "breathing_cues": p.breathing_cues,
            "category": p.category,
            "difficulty": p.difficulty
        }
        for p in selected_poses
    ]

    total_duration = sum(p["duration_sec"] + p["rest_sec"] for p in routine_poses)
    duration_mins = max(5, int(total_duration / 60))

    return {
        "id": "rec_today",
        "title": title,
        "subtitle": subtitle,
        "duration_minutes": duration_mins,
        "difficulty": experience,
        "poses_count": len(routine_poses),
        "category": category,
        "reason": reason,
        "poses": routine_poses
    }
