from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.journal import Favorite
from app.schemas.journal import FavoriteCreate, FavoriteOut
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/favorites", tags=["Favorites"])

@router.get("", response_model=List[FavoriteOut])
def get_user_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Favorite).filter(Favorite.user_id == current_user.id).order_by(Favorite.created_at.desc()).all()

@router.post("", response_model=FavoriteOut)
def add_favorite(
    data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.item_type == data.item_type,
        Favorite.item_id == data.item_id
    ).first()

    if existing:
        return existing

    fav = Favorite(
        user_id=current_user.id,
        item_type=data.item_type,
        item_id=data.item_id,
        title=data.title,
        subtitle=data.subtitle,
        image_url=data.image_url
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav

@router.delete("/{item_type}/{item_id}")
def remove_favorite(
    item_type: str,
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.item_type == item_type,
        Favorite.item_id == item_id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(fav)
    db.commit()
    return {"message": "Favorite removed"}
