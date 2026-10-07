import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from app.data.poses_curated import CURATED_POSES

print(f"Total curated poses: {len(CURATED_POSES)}")
for i, p in enumerate(CURATED_POSES, 1):
    print(f"{i:02d}. {p['name']} ({p['sanskrit_name']}) -> {p['image_url']}")
