from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str

class AssistantQueryRequest(BaseModel):
    query: str
    history: Optional[List[ChatMessage]] = []
    user_context: Optional[Dict[str, Any]] = None

class GroundedSource(BaseModel):
    title: str
    source_type: str  # pose, article, safety, breathing
    snippet: str
    url_or_id: Optional[str] = None

class AssistantQueryResponse(BaseModel):
    answer: str
    sources: List[GroundedSource] = []
    suggested_poses: List[Dict[str, Any]] = []
    disclaimer: str = "This assistant provides general educational wellness information and is not a substitute for professional medical advice."
