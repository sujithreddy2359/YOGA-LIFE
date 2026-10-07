import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
import app.models  # Ensures all models are registered on Base.metadata
from app.data.seed_data import seed_database

# Import routers
from app.api.routers.auth import router as auth_router
from app.api.routers.users import router as users_router
from app.api.routers.yoga import router as yoga_router
from app.api.routers.practice import router as practice_router
from app.api.routers.dashboard import router as dashboard_router
from app.api.routers.journey import router as journey_router
from app.api.routers.achievements import router as achievements_router
from app.api.routers.awareness import router as awareness_router
from app.api.routers.favorites import router as favorites_router
from app.api.routers.journal import router as journal_router
from app.api.routers.assistant import router as assistant_router
from app.api.routers.body_map import router as body_map_router
from app.api.routers.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title="Yoga Life API",
    description="Full-stack 3D Yoga Awareness, Practice, and Journey Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(yoga_router, prefix=settings.API_V1_STR)
app.include_router(practice_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(journey_router, prefix=settings.API_V1_STR)
app.include_router(achievements_router, prefix=settings.API_V1_STR)
app.include_router(awareness_router, prefix=settings.API_V1_STR)
app.include_router(favorites_router, prefix=settings.API_V1_STR)
app.include_router(journal_router, prefix=settings.API_V1_STR)
app.include_router(assistant_router, prefix=settings.API_V1_STR)
app.include_router(body_map_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": "Yoga Life API",
        "tagline": "Learn. Breathe. Practice. Transform.",
        "status": "healthy",
        "docs_url": "/docs"
    }
