from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AwarenessArticleOut(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    reading_time_minutes: int
    summary: str
    content: str
    did_you_know: str
    image_url: Optional[str]
    is_completed: bool = False
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class DailyAwarenessResponse(BaseModel):
    article: AwarenessArticleOut
    did_you_know: str
    completed_today: bool
    total_articles_read: int
