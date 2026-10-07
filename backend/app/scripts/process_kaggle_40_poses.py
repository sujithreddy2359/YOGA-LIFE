import os
import shutil
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent.parent
frontend_public_kaggle = backend_dir.parent / "frontend" / "public" / "kaggle_poses"
os.makedirs(frontend_public_kaggle, exist_ok=True)

kaggle_dataset_path = Path(r"C:\Users\m40su\.cache\kagglehub\datasets\niharika41298\yoga-poses-dataset\versions\1")

# Collect all Kaggle image files
kaggle_images = []
for root, dirs, files in os.walk(kaggle_dataset_path):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            full_p = Path(root) / f
            # avoid tiny or corrupt files if any
            if os.path.getsize(full_p) > 5000:
                kaggle_images.append(full_p)

print(f"Total valid Kaggle images available: {len(kaggle_images)}")

sys.path.insert(0, str(backend_dir))
from app.data.poses_curated import CURATED_POSES

# Trim to exactly 40 poses
POSES_40 = CURATED_POSES[:40]
print(f"Limiting curated poses to exactly {len(POSES_40)} poses.")

# Select 40 distinct Kaggle images (stepping evenly across the dataset for maximum visual variety)
step = len(kaggle_images) // len(POSES_40)
selected_kaggle_imgs = [kaggle_images[i * step] for i in range(len(POSES_40))]

unique_copied_urls = set()

for i, pose in enumerate(POSES_40):
    slug = pose["slug"]
    src_img = selected_kaggle_imgs[i]
    ext = src_img.suffix.lower()
    dst_name = f"{slug}{ext}"
    dst_path = frontend_public_kaggle / dst_name

    shutil.copy2(src_img, dst_path)

    image_url = f"/kaggle_poses/{dst_name}"
    pose["image_url"] = image_url
    unique_copied_urls.add(image_url)

print(f"Successfully copied 40 Kaggle pose images to {frontend_public_kaggle}")
print(f"Total poses: {len(POSES_40)}, Unique Image URLs: {len(unique_copied_urls)}")
assert len(POSES_40) == len(unique_copied_urls), "Duplicate images found!"

# Write back the trimmed 40 poses to app/data/poses_curated.py
poses_curated_path = backend_dir / "app" / "data" / "poses_curated.py"

file_content = f"""# Curated Yoga Pose Dataset — Exactly 40 poses mapped to Kaggle Yoga Poses Dataset
# Sources: niharika41298/yoga-poses-dataset (Kaggle) & Iyengar Yoga Canonical List

CURATED_POSES = {POSES_40!r}
"""

# Format python file content neatly
with open(poses_curated_path, "w", encoding="utf-8") as f:
    f.write(file_content)

print(f"Successfully updated {poses_curated_path} with 40 Kaggle poses!")
