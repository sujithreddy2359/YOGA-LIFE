from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, Profile
from app.models.yoga import YogaPose, YogaCategory
from app.models.practice import YogaSession, PracticeHistory
from app.models.awareness import AwarenessArticle
from app.schemas.yoga import YogaPoseCreate, YogaPoseOut, YogaCategoryOut
from app.schemas.awareness import AwarenessArticleOut
from app.schemas.user import UserOut
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/metrics")
def get_admin_metrics(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_sessions = db.query(YogaSession).count()
    total_poses = db.query(YogaPose).count()
    total_articles = db.query(AwarenessArticle).count()

    all_completed = db.query(YogaSession).filter(YogaSession.status == "completed").all()
    total_practice_sec = sum(s.duration_seconds or 0 for s in all_completed)
    total_hours = round(total_practice_sec / 3600.0, 1)

    return {
        "total_users": total_users,
        "total_practice_sessions": total_sessions,
        "total_poses_in_library": total_poses,
        "total_awareness_articles": total_articles,
        "total_practice_hours_logged": total_hours,
        "active_users_this_month": max(1, total_users)
    }

@router.get("/users", response_model=List[UserOut])
def list_all_users(
    limit: int = Query(50, ge=1, le=100),
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.created_at.desc()).limit(limit).all()

@router.post("/poses", response_model=YogaPoseOut)
def create_yoga_pose(
    data: YogaPoseCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(YogaPose).filter(YogaPose.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A pose with this slug already exists")

    pose = YogaPose(**data.dict())
    db.add(pose)
    db.commit()
    db.refresh(pose)
    return pose

@router.put("/poses/{pose_id}", response_model=YogaPoseOut)
def update_yoga_pose(
    pose_id: int,
    data: YogaPoseCreate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    pose = db.query(YogaPose).filter(YogaPose.id == pose_id).first()
    if not pose:
        raise HTTPException(status_code=404, detail="Pose not found")

    for k, v in data.dict().items():
        setattr(pose, k, v)

    db.commit()
    db.refresh(pose)
    return pose

@router.delete("/poses/{pose_id}")
def delete_yoga_pose(
    pose_id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    pose = db.query(YogaPose).filter(YogaPose.id == pose_id).first()
    if not pose:
        raise HTTPException(status_code=404, detail="Pose not found")

    db.delete(pose)
    db.commit()
    return {"message": "Pose deleted successfully", "pose_id": pose_id}
