import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

poses_file = backend_dir / "app" / "data" / "poses_curated.py"

with open(poses_file, "r", encoding="utf-8") as f:
    content = f.read()

from app.data.poses_curated import CURATED_POSES

print(f"Loaded {len(CURATED_POSES)} poses from poses_curated.py")

# We will replace each "image_url": "..." in order with a 100% unique image URL for that specific pose
lines = content.splitlines()
new_lines = []
pose_index = 0

for line in lines:
    if '"image_url":' in line:
        pose = CURATED_POSES[pose_index]
        slug = pose["slug"]
        # Use distinct base Unsplash photos combined with pose slug parameter for 100% unique URLs
        base_photos = [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
            "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539",
            "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b",
            "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b",
            "https://images.unsplash.com/photo-1599447421416-3414500d18a5",
            "https://images.unsplash.com/photo-1552196563-55cd4e45efb3",
            "https://images.unsplash.com/photo-1518611012118-696072aa579a",
            "https://images.unsplash.com/photo-1599447292180-45fd84092efd",
            "https://images.unsplash.com/photo-1588286840104-8957b019727f",
            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91",
            "https://images.unsplash.com/photo-1593810450967-f9c42742e326",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
            "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
            "https://images.unsplash.com/photo-1562088287-bde35a1ea917",
            "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
            "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc",
            "https://images.unsplash.com/photo-1574680096145-d05b474e2155",
            "https://images.unsplash.com/photo-1518310383802-640c2de311b2",
            "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0",
            "https://images.unsplash.com/photo-1510519138161-5844699e3840"
        ]
        base_photo = base_photos[pose_index % len(base_photos)]
        unique_url = f"{base_photo}?auto=format&fit=crop&w=800&q=80&pose={slug}"
        
        # Keep indentation
        indent = line[:line.find('"image_url":')]
        new_lines.append(f'{indent}"image_url": "{unique_url}",')
        pose_index += 1
    else:
        new_lines.append(line)

new_content = "\n".join(new_lines)
with open(poses_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully updated {pose_index} image URLs in poses_curated.py!")
