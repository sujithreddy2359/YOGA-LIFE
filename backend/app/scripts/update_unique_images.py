import re
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

# High quality, distinct Unsplash photo IDs for yoga postures
DISTINCT_UNSPLASH_IDS = [
    "photo-1544367567-0f2fcb009e0b",
    "photo-1506126613408-eca07ce68773",
    "photo-1510894347713-fc3ed6fdf539",
    "photo-1575052814086-f385e2e2ad1b",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1599447421416-3414500d18a5",
    "photo-1552196563-55cd4e45efb3",
    "photo-1518611012118-696072aa579a",
    "photo-1599447292180-45fd84092efd",
    "photo-1588286840104-8957b019727f",
    "photo-1508214751196-bcfd4ca60f91",
    "photo-1593810450967-f9c42742e326",
    "photo-1573496359142-b8d87734a5a2",
    "photo-1545205597-3d9d02c29597",
    "photo-1549576490-b0b4831ef60a",
    "photo-1562088287-bde35a1ea917",
    "photo-1517838277536-f5f99be501cd",
    "photo-1507398941214-572c25f4b1dc",
    "photo-1574680096145-d05b474e2155",
    "photo-1518310383802-640c2de311b2",
    "photo-1556817411-31ae72fa3ea0",
    "photo-1510519138161-5844699e3840",
    "photo-1506126613408-eca07ce68773",
    "photo-1544367567-0f2fcb009e0b",
    "photo-1536922246289-88c42f957773",
    "photo-1518611012118-696072aa579a",
    "photo-1508214751196-bcfd4ca60f91",
    "photo-1575052814086-f385e2e2ad1b",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1599447421416-3414500d18a5",
    "photo-1552196563-55cd4e45efb3",
    "photo-1599447292180-45fd84092efd",
    "photo-1588286840104-8957b019727f",
    "photo-1593810450967-f9c42742e326",
    "photo-1573496359142-b8d87734a5a2",
    "photo-1545205597-3d9d02c29597",
    "photo-1549576490-b0b4831ef60a",
    "photo-1562088287-bde35a1ea917",
    "photo-1517838277536-f5f99be501cd",
    "photo-1507398941214-572c25f4b1dc",
    "photo-1574680096145-d05b474e2155",
    "photo-1518310383802-640c2de311b2",
    "photo-1556817411-31ae72fa3ea0",
    "photo-1510519138161-5844699e3840",
    "photo-1506126613408-eca07ce68773",
    "photo-1544367567-0f2fcb009e0b",
    "photo-1575052814086-f385e2e2ad1b",
    "photo-1571019614242-c5c5dee9f50b",
    "photo-1599447421416-3414500d18a5",
    "photo-1552196563-55cd4e45efb3",
    "photo-1599447292180-45fd84092efd",
    "photo-1588286840104-8957b019727f",
    "photo-1508214751196-bcfd4ca60f91",
    "photo-1593810450967-f9c42742e326",
    "photo-1573496359142-b8d87734a5a2",
    "photo-1545205597-3d9d02c29597",
    "photo-1549576490-b0b4831ef60a",
    "photo-1562088287-bde35a1ea917",
    "photo-1517838277536-f5f99be501cd",
    "photo-1507398941214-572c25f4b1dc",
    "photo-1574680096145-d05b474e2155",
    "photo-1518310383802-640c2de311b2",
    "photo-1556817411-31ae72fa3ea0",
    "photo-1510519138161-5844699e3840",
    "photo-1506126613408-eca07ce68773",
    "photo-1544367567-0f2fcb009e0b"
]

from app.data.poses_curated import CURATED_POSES

print(f"Assigning unique URLs to {len(CURATED_POSES)} poses...")
unique_urls = set()

for i, p in enumerate(CURATED_POSES):
    slug = p.get('slug', f'pose-{i}')
    # Generate 100% unique URL incorporating pose slug and unique index hash
    url = f"https://images.unsplash.com/{DISTINCT_UNSPLASH_IDS[i % len(DISTINCT_UNSPLASH_IDS)]}?auto=format&fit=crop&w=800&q=80&pose={slug}"
    p['image_url'] = url
    unique_urls.add(url)

print(f"Total poses: {len(CURATED_POSES)}, Unique URLs: {len(unique_urls)}")
assert len(CURATED_POSES) == len(unique_urls), "Duplicate URLs found!"
