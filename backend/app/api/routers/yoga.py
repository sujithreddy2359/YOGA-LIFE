from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.database import get_db
from app.models.yoga import YogaPose, YogaCategory, CustomRoutine
from app.schemas.yoga import (
    YogaPoseOut, YogaCategoryOut, CustomRoutineCreate, CustomRoutineOut
)
from app.api.deps import get_current_user, get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/yoga", tags=["Yoga Exploration"])

@router.get("/categories", response_model=List[YogaCategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return db.query(YogaCategory).all()

@router.get("/poses", response_model=List[YogaPoseOut])
def get_poses(
    search: Optional[str] = Query(None, description="Search by name, Sanskrit name, or tags"),
    category: Optional[str] = Query(None, description="Filter by category"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    body_target: Optional[str] = Query(None, description="Filter by body focus"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(YogaPose)

    if category and category.lower() != "all":
        query = query.filter(YogaPose.category.ilike(f"%{category}%"))
    if difficulty and difficulty.lower() != "all":
        query = query.filter(YogaPose.difficulty.ilike(f"%{difficulty}%"))
    if body_target and body_target.lower() != "all":
        query = query.filter(YogaPose.body_target.ilike(f"%{body_target}%"))
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                YogaPose.name.ilike(search_filter),
                YogaPose.sanskrit_name.ilike(search_filter),
                YogaPose.description.ilike(search_filter)
            )
        )

    return query.offset(offset).limit(limit).all()

@router.get("/poses/{pose_id}", response_model=YogaPoseOut)
def get_pose_by_id(pose_id: int, db: Session = Depends(get_db)):
    pose = db.query(YogaPose).filter(YogaPose.id == pose_id).first()
    if not pose:
        raise HTTPException(status_code=404, detail="Yoga pose not found")
    return pose

@router.get("/poses/slug/{slug}", response_model=YogaPoseOut)
def get_pose_by_slug(slug: str, db: Session = Depends(get_db)):
    pose = db.query(YogaPose).filter(YogaPose.slug == slug).first()
    if not pose:
        raise HTTPException(status_code=404, detail="Yoga pose not found")
    return pose

# Custom Routines
@router.post("/routines", response_model=CustomRoutineOut)
def create_custom_routine(
    data: CustomRoutineCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    poses_list = [p.dict() for p in data.poses]
    total_sec = sum((p.duration_sec + p.rest_sec) for p in data.poses)

    routine = CustomRoutine(
        user_id=current_user.id,
        title=data.title,
        description=data.description,
        category=data.category or "Custom",
        difficulty=data.difficulty or "Beginner",
        poses_json=poses_list,
        total_duration_sec=total_sec,
        is_public=data.is_public or 0
    )
    db.add(routine)
    db.commit()
    db.refresh(routine)
    return routine

@router.get("/routines", response_model=List[CustomRoutineOut])
def get_user_custom_routines(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(CustomRoutine).filter(CustomRoutine.user_id == current_user.id).order_by(CustomRoutine.created_at.desc()).all()
