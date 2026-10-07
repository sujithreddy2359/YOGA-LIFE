from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User, Profile
from app.models.yoga import YogaCategory, YogaPose
from app.models.journey import JourneyMilestone, Achievement
from app.models.awareness import AwarenessArticle
from app.data.poses_curated import CURATED_POSES
from app.data.awareness_curated import YOGA_TYPES_DATA, AWARENESS_ARTICLES_DATA

def seed_database(db: Session):
    # 1. Seed Admin User
    admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = User(
            email=settings.ADMIN_EMAIL,
            full_name="Yoga Life Master Admin",
            phone_number="+10000000000",
            hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        db.flush()
        
        admin_profile = Profile(
            user_id=admin.id,
            primary_goal="General Wellness",
            experience_level="Advanced",
            preferred_duration_minutes=30,
            preferred_time_of_day="Morning",
            bio="Lead instructor and platform administrator at Yoga Life.",
            is_onboarded=True
        )
        db.add(admin_profile)
        db.commit()

    # 2. Seed Yoga Categories
    for cat_data in YOGA_TYPES_DATA:
        existing = db.query(YogaCategory).filter(YogaCategory.slug == cat_data["slug"]).first()
        if not existing:
            cat = YogaCategory(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                difficulty=cat_data.get("difficulty", "All Levels"),
                typical_duration=cat_data.get("typical_duration", "30 mins"),
                purpose=cat_data.get("purpose", "Wellness"),
                icon=cat_data.get("icon", "Sparkles"),
                image_url=cat_data.get("image_url")
            )
            db.add(cat)
    db.commit()

    # 3. Seed Canonical Yoga Poses
    for pose_data in CURATED_POSES:
        existing = db.query(YogaPose).filter(YogaPose.slug == pose_data["slug"]).first()
        if existing:
            existing.image_url = pose_data.get("image_url")
            existing.name = pose_data["name"]
            existing.sanskrit_name = pose_data.get("sanskrit_name")
            existing.category = pose_data["category"]
            existing.difficulty = pose_data["difficulty"]
            existing.description = pose_data["description"]
            existing.instructions = pose_data["instructions"]
            existing.benefits = pose_data["benefits"]
            existing.precautions = pose_data["precautions"]
            existing.breathing_cues = pose_data["breathing_cues"]
            existing.model_3d_type = pose_data.get("model_3d_type", "tree_pose")
        else:
            pose = YogaPose(
                name=pose_data["name"],
                sanskrit_name=pose_data.get("sanskrit_name"),
                slug=pose_data["slug"],
                category=pose_data["category"],
                difficulty=pose_data["difficulty"],
                recommended_duration_sec=pose_data.get("recommended_duration_sec", 30),
                has_sides=pose_data.get("has_sides", 1),
                body_target=pose_data.get("body_target", "Full Body"),
                tags=pose_data.get("tags", []),
                description=pose_data["description"],
                instructions=pose_data["instructions"],
                benefits=pose_data["benefits"],
                precautions=pose_data["precautions"],
                breathing_cues=pose_data["breathing_cues"],
                image_url=pose_data.get("image_url"),
                model_3d_type=pose_data.get("model_3d_type", "tree_pose")
            )
            db.add(pose)
    
    # Purge any old poses not in the curated 40 list
    valid_slugs = set(p["slug"] for p in CURATED_POSES)
    db.query(YogaPose).filter(~YogaPose.slug.in_(valid_slugs)).delete(synchronize_session=False)
    db.commit()

    # 4. Seed Journey Milestones (Day 1, Day 7, Day 14, Day 30)
    milestones_data = [
        {
            "day_number": 1,
            "title": "Beginner",
            "subtitle": "Welcome to Yoga Life",
            "badge_code": "beginner_day_1",
            "badge_icon": "Sprout",
            "badge_emoji": "🌱",
            "description": "You have stepped onto your mat and started your mindful practice journey.",
            "required_practice_days": 1,
            "unlock_reward_title": "🌱 Beginner Badge",
            "unlock_reward_description": "Foundational practice sequences and posture awareness tracking unlocked.",
            "order_index": 1
        },
        {
            "day_number": 7,
            "title": "Consistency Badge",
            "subtitle": "Habit Established",
            "badge_code": "consistency_day_7",
            "badge_icon": "Flame",
            "badge_emoji": "🔥",
            "description": "You have built a regular 7-day practice habit. Consistency is the soil where transformation blooms.",
            "required_practice_days": 7,
            "unlock_reward_title": "🔥 Consistency Badge",
            "unlock_reward_description": "Unlocked intermediate daily flow recommendations and custom sequence builder.",
            "order_index": 2
        },
        {
            "day_number": 14,
            "title": "Flexibility Journey",
            "subtitle": "Two Weeks of Mindful Practice",
            "badge_code": "flexibility_day_14",
            "badge_icon": "Activity",
            "badge_emoji": "🤸",
            "description": "You have achieved two full weeks of practice. Your connective fascia and neural pathways are adapting.",
            "required_practice_days": 14,
            "unlock_reward_title": "🤸 Flexibility Journey Routines",
            "unlock_reward_description": "Exclusive deep hip opening, hamstring mobility, and thoracic spine flows unlocked.",
            "order_index": 3
        },
        {
            "day_number": 30,
            "title": "Yoga Life Champion",
            "subtitle": "30 Days of Complete Dedication",
            "badge_code": "champion_day_30",
            "badge_icon": "Trophy",
            "badge_emoji": "🏆",
            "description": "30 days of dedication! You completed your first major Yoga Life journey and transformed your daily life.",
            "required_practice_days": 30,
            "unlock_reward_title": "🏆 Yoga Life Champion Master Badge",
            "unlock_reward_description": "Permanent Gold Champion status and full access to advanced masterclass series.",
            "order_index": 4
        }
    ]

    for m_data in milestones_data:
        existing = db.query(JourneyMilestone).filter(JourneyMilestone.day_number == m_data["day_number"]).first()
        if not existing:
            milestone = JourneyMilestone(**m_data)
            db.add(milestone)
    db.commit()

    # 5. Seed Achievements
    achievements_data = [
        {
            "code": "first_practice",
            "title": "First Practice",
            "description": "Completed your first guided yoga practice session.",
            "icon": "Sprout",
            "emoji": "🌱",
            "category": "practice",
            "criteria_type": "sessions_count",
            "threshold_value": 1,
            "badge_color": "emerald"
        },
        {
            "code": "streak_7_days",
            "title": "7-Day Streak",
            "description": "Practiced yoga 7 days in a row without breaking your streak.",
            "icon": "Flame",
            "emoji": "🔥",
            "category": "streak",
            "criteria_type": "streak_days",
            "threshold_value": 7,
            "badge_color": "amber"
        },
        {
            "code": "flexibility_explorer",
            "title": "Flexibility Explorer",
            "description": "Explored and completed 5 different flexibility & mobility poses.",
            "icon": "Zap",
            "emoji": "🤸",
            "category": "diversity",
            "criteria_type": "pose_diversity",
            "threshold_value": 5,
            "badge_color": "indigo"
        },
        {
            "code": "sessions_10",
            "title": "10 Sessions",
            "description": "Completed 10 mindful practice sessions on the platform.",
            "icon": "Sparkles",
            "emoji": "🧘",
            "category": "practice",
            "criteria_type": "sessions_count",
            "threshold_value": 10,
            "badge_color": "sky"
        },
        {
            "code": "minutes_100",
            "title": "100 Minutes",
            "description": "Accumulated 100 minutes of total mindful practice on your mat.",
            "icon": "Clock",
            "emoji": "⏱️",
            "category": "duration",
            "criteria_type": "total_minutes",
            "threshold_value": 100,
            "badge_color": "teal"
        },
        {
            "code": "practice_days_10",
            "title": "10 Practice Days",
            "description": "Logged practice across 10 unique calendar days.",
            "icon": "Calendar",
            "emoji": "🌟",
            "category": "milestone",
            "criteria_type": "unique_days",
            "threshold_value": 10,
            "badge_color": "violet"
        },
        {
            "code": "champion_30_days",
            "title": "Yoga Life Champion",
            "description": "Completed 30 unique practice days and conquered the 30-Day Yoga Journey.",
            "icon": "Trophy",
            "emoji": "🏆",
            "category": "mastery",
            "criteria_type": "unique_days",
            "threshold_value": 30,
            "badge_color": "yellow"
        },
        {
            "code": "hours_10",
            "title": "10 Hours Practiced",
            "description": "Accumulated a total of 600 minutes (10 full hours) of yoga practice.",
            "icon": "Award",
            "emoji": "💎",
            "category": "duration",
            "criteria_type": "total_minutes",
            "threshold_value": 600,
            "badge_color": "cyan"
        }
    ]

    for a_data in achievements_data:
        existing = db.query(Achievement).filter(Achievement.code == a_data["code"]).first()
        if not existing:
            ach = Achievement(**a_data)
            db.add(ach)
    db.commit()

    # 6. Seed Awareness Articles
    for art_data in AWARENESS_ARTICLES_DATA:
        existing = db.query(AwarenessArticle).filter(AwarenessArticle.slug == art_data["slug"]).first()
        if not existing:
            art = AwarenessArticle(
                title=art_data["title"],
                slug=art_data["slug"],
                category=art_data["category"],
                reading_time_minutes=art_data.get("reading_time_minutes", 3),
                summary=art_data["summary"],
                content=art_data["content"],
                did_you_know=art_data["did_you_know"],
                image_url=art_data.get("image_url"),
                day_of_year_index=art_data.get("day_of_year_index", 1)
            )
            db.add(art)
    db.commit()
