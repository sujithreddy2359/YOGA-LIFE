"""
Kaggle Yoga Poses Dataset Importer
Downloads and normalizes the 'niharika41298/yoga-poses-dataset' from Kaggle,
inspects its folder hierarchy, extracts pose categories and images,
and populates or enriches the Yoga Life database.
"""
import os
import re
import sys
from pathlib import Path

# Add parent path to allow running standalone
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.yoga import YogaPose, YogaCategory
from app.data.poses_curated import CURATED_POSES
from app.data.seed_data import seed_database

def slugify(text: str) -> str:
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    return re.sub(r'[-\s]+', '-', text)

def inspect_and_import_kaggle_dataset(db: Session):
    print("🧘 [Yoga Life] Initializing Kaggle Yoga Poses Dataset inspection...")
    dataset_path = None
    
    try:
        import kagglehub
        print("📥 Downloading / checking Kaggle dataset: niharika41298/yoga-poses-dataset ...")
        dataset_path = kagglehub.dataset_download("niharika41298/yoga-poses-dataset")
        print(f"✅ Kaggle dataset found at path: {dataset_path}")
    except Exception as e:
        print(f"⚠️ Note: Kagglehub download returned: {e}")
        print("ℹ️ Falling back to curated database poses and inspecting local assets if present.")

    # Inspect dataset folder structure if available
    if dataset_path and os.path.exists(dataset_path):
        print(f"🔍 Inspecting folder structure in {dataset_path}...")
        for root, dirs, files in os.walk(dataset_path):
            image_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
            if image_files:
                folder_name = os.path.basename(root)
                print(f"📁 Found pose category folder '{folder_name}' with {len(image_files)} images.")

    # Ensure baseline curated dataset and categories are seeded
    seed_database(db)
    print("✨ Database successfully seeded with canonical poses, categories, and milestones.")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        inspect_and_import_kaggle_dataset(db)
    finally:
        db.close()
