import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

poses_file = backend_dir / "app" / "data" / "poses_curated.py"

with open(poses_file, "r", encoding="utf-8") as f:
    content = f.read()

from app.data.poses_curated import CURATED_POSES

lines = content.splitlines()
new_lines = []
pose_index = 0

for line in lines:
    if '"image_url":' in line:
        pose = CURATED_POSES[pose_index]
        slug = pose["slug"]
        svg_url = f"/poses/{slug}.svg"
        
        # Keep indentation
        indent = line[:line.find('"image_url":')]
        new_lines.append(f'{indent}"image_url": "{svg_url}",')
        pose_index += 1
    else:
        new_lines.append(line)

new_content = "\n".join(new_lines)
with open(poses_file, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"Successfully updated {pose_index} pose image URLs to local SVG graphics in poses_curated.py!")
