import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Yoga Life"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "yogalife-super-secret-production-key-2026-breathe-practice")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./yoga_life.db"  # Works out-of-the-box, easily points to postgresql://user:pass@localhost:5432/yogalife
    )
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Gemini / LLM API Key (optional for live model, fallback RAG semantic engine always works)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Admin Credentials
    ADMIN_EMAIL: str = "admin@yogalife.app"
    ADMIN_PASSWORD: str = "YogaLifeAdmin2026!"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
