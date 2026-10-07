from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.assistant import AssistantQueryRequest, AssistantQueryResponse
from app.services.rag_service import YogaRAGService
from app.api.deps import get_current_user_optional
from app.models.user import User

router = APIRouter(prefix="/assistant", tags=["AI Yoga Assistant (RAG)"])

@router.post("/query", response_model=AssistantQueryResponse)
def query_ai_assistant(
    data: AssistantQueryRequest,
    current_user: User = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    rag_service = YogaRAGService(db=db)
    
    user_context = {}
    if current_user and current_user.profile:
        user_context = {
            "goal": current_user.profile.primary_goal,
            "experience": current_user.profile.experience_level,
            "preferred_duration": current_user.profile.preferred_duration_minutes,
            "name": current_user.full_name
        }

    response = rag_service.answer_query(query=data.query, user_context=user_context)
    return response
