from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.awareness import AwarenessArticle, AwarenessProgress
from app.schemas.awareness import AwarenessArticleOut, DailyAwarenessResponse
from app.api.deps import get_current_user_optional, get_current_user
from app.models.user import User

router = APIRouter(prefix="/awareness", tags=["Yoga Awareness"])

@router.get("", response_model=List[AwarenessArticleOut])
def get_awareness_articles(
    category: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    query = db.query(AwarenessArticle)
    if category and category.lower() != "all":
        query = query.filter(AwarenessArticle.category.ilike(f"%{category}%"))

    articles = query.all()
    completed_ids = set()
    completed_map = {}

    if current_user:
        for p in db.query(AwarenessProgress).filter(AwarenessProgress.user_id == current_user.id).all():
            completed_ids.add(p.article_id)
            completed_map[p.article_id] = p.completed_at

    out = []
    for a in articles:
        out.append(AwarenessArticleOut(
            id=a.id,
            title=a.title,
            slug=a.slug,
            category=a.category,
            reading_time_minutes=a.reading_time_minutes,
            summary=a.summary,
            content=a.content,
            did_you_know=a.did_you_know,
            image_url=a.image_url,
            is_completed=a.id in completed_ids,
            completed_at=completed_map.get(a.id)
        ))
    return out

@router.get("/today", response_model=DailyAwarenessResponse)
def get_today_awareness(
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    articles = db.query(AwarenessArticle).all()
    if not articles:
        raise HTTPException(status_code=404, detail="No awareness articles available")

    # Pick daily article based on day of year
    day_of_year = datetime.now(timezone.utc).timetuple().tm_yday
    selected_article = articles[day_of_year % len(articles)]

    is_completed = False
    completed_at = None
    total_read = 0

    if current_user:
        prog = db.query(AwarenessProgress).filter(
            AwarenessProgress.user_id == current_user.id,
            AwarenessProgress.article_id == selected_article.id
        ).first()
        if prog and prog.is_completed:
            is_completed = True
            completed_at = prog.completed_at

        total_read = db.query(AwarenessProgress).filter(
            AwarenessProgress.user_id == current_user.id,
            AwarenessProgress.is_completed == True
        ).count()

    article_out = AwarenessArticleOut(
        id=selected_article.id,
        title=selected_article.title,
        slug=selected_article.slug,
        category=selected_article.category,
        reading_time_minutes=selected_article.reading_time_minutes,
        summary=selected_article.summary,
        content=selected_article.content,
        did_you_know=selected_article.did_you_know,
        image_url=selected_article.image_url,
        is_completed=is_completed,
        completed_at=completed_at
    )

    return {
        "article": article_out,
        "did_you_know": selected_article.did_you_know,
        "completed_today": is_completed,
        "total_articles_read": total_read
    }

@router.post("/{article_id}/complete")
def mark_article_completed(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    article = db.query(AwarenessArticle).filter(AwarenessArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    prog = db.query(AwarenessProgress).filter(
        AwarenessProgress.user_id == current_user.id,
        AwarenessProgress.article_id == article_id
    ).first()

    now = datetime.now(timezone.utc)
    if not prog:
        prog = AwarenessProgress(
            user_id=current_user.id,
            article_id=article_id,
            is_completed=True,
            completed_at=now
        )
        db.add(prog)
    else:
        prog.is_completed = True
        prog.completed_at = now

    db.commit()
    return {"message": "Article marked as learned", "article_id": article_id, "completed_at": now}
