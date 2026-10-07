from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, Profile
from app.schemas.user import UserOut, ProfileUpdate, OnboardingSubmit
from app.api.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_current_user_profile(
    data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if data.avatar_url is not None:
        profile.avatar_url = data.avatar_url
    if data.primary_goal is not None:
        profile.primary_goal = data.primary_goal
    if data.experience_level is not None:
        profile.experience_level = data.experience_level
    if data.preferred_duration_minutes is not None:
        profile.preferred_duration_minutes = data.preferred_duration_minutes
    if data.preferred_time_of_day is not None:
        profile.preferred_time_of_day = data.preferred_time_of_day
    if data.bio is not None:
        profile.bio = data.bio

    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/onboarding", response_model=UserOut)
def submit_onboarding(
    data: OnboardingSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = current_user.profile
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    profile.primary_goal = data.primary_goal
    profile.experience_level = data.experience_level
    profile.preferred_duration_minutes = data.preferred_duration_minutes
    profile.preferred_time_of_day = data.preferred_time_of_day
    profile.is_onboarded = True

    db.commit()
    db.refresh(current_user)
    return current_user
