from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.yoga import YogaPose
from app.schemas.yoga import YogaPoseOut

router = APIRouter(prefix="/body-map", tags=["Body & Goal Map"])

BODY_REGIONS_META = {
    "Full Body": {
        "title": "Full Body Integration",
        "description": "Comprehensive harmonizing flow that mobilizes major joint complexes, elongates the spine, and unifies breath and movement.",
        "recommended_types": ["Hatha Yoga", "Vinyasa Yoga"]
    },
    "Shoulders": {
        "title": "Shoulders & Upper Thoracic",
        "description": "Releases upper back tightness, expands pectoral mobility, and opens the chest to counter desk-bound slouching.",
        "recommended_types": ["Restorative Yoga", "Hatha Yoga"]
    },
    "Back": {
        "title": "Spine & Lumbar Health",
        "description": "Gentle flexion, extension, and lateral movements to decompress intervertebral space and nourish spinal ligaments.",
        "recommended_types": ["Hatha Yoga", "Yin Yoga"]
    },
    "Core": {
        "title": "Core Stability & Center",
        "description": "Strengthens the transverse abdominis, obliques, and pelvic floor to create deep lumbar protection and inner fire.",
        "recommended_types": ["Vinyasa Yoga", "Ashtanga Yoga"]
    },
    "Legs": {
        "title": "Legs, Hamstrings & Calves",
        "description": "Elongates the posterior chain, stabilizes knee tracking, and increases lower body grounding power.",
        "recommended_types": ["Hatha Yoga", "Vinyasa Yoga"]
    },
    "Balance": {
        "title": "Balance & Proprioception",
        "description": "Cultivates neuromuscular balance, ankle stabilizer strength, and single-pointed mental clarity.",
        "recommended_types": ["Hatha Yoga", "Meditation"]
    },
    "Mobility": {
        "title": "Hip & Pelvic Mobility",
        "description": "Unlocks hip rotational range of motion and eases connective tissue tension in the pelvis.",
        "recommended_types": ["Yin Yoga", "Restorative Yoga"]
    },
    "Relaxation": {
        "title": "Nervous System Reset & Relaxation",
        "description": "Downregulates sympathetic fight-or-flight signaling, gently slows heart rate, and fosters deep restorative calm.",
        "recommended_types": ["Restorative Yoga", "Pranayama"]
    }
}

@router.get("/regions")
def get_body_regions():
    return BODY_REGIONS_META

@router.get("/poses/{region_name}", response_model=List[YogaPoseOut])
def get_poses_by_region(region_name: str, db: Session = Depends(get_db)):
    poses = db.query(YogaPose).filter(
        (YogaPose.body_target.ilike(f"%{region_name}%")) |
        (YogaPose.category.ilike(f"%{region_name}%"))
    ).all()

    if not poses:
        # Fallback to general poses
        poses = db.query(YogaPose).limit(6).all()
    return poses
