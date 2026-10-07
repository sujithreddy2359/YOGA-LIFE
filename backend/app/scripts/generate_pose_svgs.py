import os
import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

output_dir = Path(__file__).resolve().parent.parent.parent.parent / "frontend" / "public" / "poses"
os.makedirs(output_dir, exist_ok=True)

from app.data.poses_curated import CURATED_POSES

print(f"Generating 66 distinct pose vector graphics into {output_dir}...")

CATEGORY_STYLES = {
    "Standing": {"bg1": "#061f18", "bg2": "#0b3c2f", "accent": "#10b981", "glow": "#34d399", "emoji": "🧍"},
    "Backbend": {"bg1": "#241403", "bg2": "#452406", "accent": "#f59e0b", "glow": "#fbbf24", "emoji": "🌈"},
    "Sitting": {"bg1": "#170f2c", "bg2": "#2b1b4d", "accent": "#8b5cf6", "glow": "#a78bfa", "emoji": "🧘"},
    "Inversion": {"bg1": "#091a30", "bg2": "#11325c", "accent": "#3b82f6", "glow": "#60a5fa", "emoji": "🙃"},
    "Balancing": {"bg1": "#052224", "bg2": "#094145", "accent": "#14b8a6", "glow": "#2dd4bf", "emoji": "⚖️"},
    "Restorative": {"bg1": "#280b18", "bg2": "#4d152e", "accent": "#f43f5e", "glow": "#fb7185", "emoji": "🌸"},
    "Hip Opener": {"bg1": "#231102", "bg2": "#472205", "accent": "#d97706", "glow": "#fbbf24", "emoji": "🦋"},
    "Core": {"bg1": "#290f05", "bg2": "#541e0b", "accent": "#ea580c", "glow": "#fb923c", "emoji": "🔥"},
    "Twisting": {"bg1": "#1a0b2e", "bg2": "#36165e", "accent": "#c084fc", "glow": "#e879f9", "emoji": "🌀"},
    "Yin": {"bg1": "#091e24", "bg2": "#123b47", "accent": "#06b6d4", "glow": "#22d3ee", "emoji": "☯️"},
    "Pranayama": {"bg1": "#061b24", "bg2": "#0c3547", "accent": "#38bdf8", "glow": "#7dd3fc", "emoji": "🌬️"},
    "Flow": {"bg1": "#142409", "bg2": "#294713", "accent": "#84cc16", "glow": "#a3e635", "emoji": "🌊"}
}

# Custom posture vector paths tailored to each pose shape
def get_pose_paths(slug, category):
    # Center is (400, 270)
    if "tree" in slug:
        # Single standing leg, raised arms overhead
        return """
        <line x1="400" y1="360" x2="400" y2="240" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
        <line x1="400" y1="280" x2="440" y2="320" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        <line x1="440" y1="320" x2="400" y2="320" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        <line x1="400" y1="200" x2="400" y2="240" stroke="currentColor" stroke-width="10"/>
        <circle cx="400" cy="180" r="22" fill="currentColor"/>
        <path d="M 400 220 Q 360 160 380 120" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M 400 220 Q 440 160 420 120" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round"/>
        """
    elif "warrior-2" in slug or "warrior-ii" in slug:
        # Wide stance, bent front knee, horizontal arms
        return """
        <path d="M 320 370 L 360 290 L 400 250 L 460 290 L 490 370" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="400" cy="190" r="22" fill="currentColor"/>
        <line x1="400" y1="212" x2="400" y2="260" stroke="currentColor" stroke-width="12"/>
        <line x1="280" y1="230" x2="520" y2="230" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        """
    elif "warrior-1" in slug:
        # Lunge stance, arms raised high
        return """
        <path d="M 330 370 L 370 290 L 400 250 L 450 300 L 450 370" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="400" cy="185" r="22" fill="currentColor"/>
        <line x1="400" y1="207" x2="400" y2="255" stroke="currentColor" stroke-width="12"/>
        <line x1="400" y1="230" x2="370" y2="130" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
        <line x1="400" y1="230" x2="430" y2="130" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
        """
    elif "downward" in slug or "downdog" in slug:
        # Inverted V shape
        return """
        <path d="M 280 370 L 400 200 L 520 370" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="380" cy="230" r="20" fill="currentColor"/>
        """
    elif "cobra" in slug or "upward" in slug:
        # Lying with arched back
        return """
        <path d="M 270 360 C 340 360 360 350 400 280 C 420 240 430 220 440 210" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="455" cy="195" r="22" fill="currentColor"/>
        <line x1="400" y1="280" x2="400" y2="360" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        """
    elif "child" in slug or "balasana" in slug:
        # Folded resting pose
        return """
        <path d="M 480 350 C 440 350 400 320 360 320 C 330 320 310 340 300 350" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round"/>
        <circle cx="280" cy="355" r="20" fill="currentColor"/>
        <line x1="360" y1="330" x2="250" y2="360" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
        """
    elif "lotus" in slug or "easy-pose" in slug or "sukhasana" in slug or "padmasana" in slug or "pranayama" in category.lower():
        # Seated cross-legged meditation
        return """
        <path d="M 310 350 Q 400 380 490 350" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round"/>
        <line x1="400" y1="340" x2="400" y2="230" stroke="currentColor" stroke-width="12"/>
        <circle cx="400" cy="190" r="22" fill="currentColor"/>
        <path d="M 400 240 L 330 300 M 400 240 L 470 300" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        """
    elif "triangle" in slug or "trikonasana" in slug:
        # Wide legs, one hand reaching down to ankle, one hand reaching up
        return """
        <path d="M 320 370 L 400 250 L 480 370" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round"/>
        <circle cx="400" cy="195" r="20" fill="currentColor"/>
        <line x1="400" y1="215" x2="400" y2="255" stroke="currentColor" stroke-width="12"/>
        <line x1="400" y1="240" x2="340" y2="340" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
        <line x1="400" y1="240" x2="460" y2="130" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>
        """
    elif "plank" in slug or "chaturanga" in slug:
        # Horizontal straight line
        return """
        <line x1="260" y1="310" x2="520" y2="270" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>
        <circle cx="535" cy="255" r="20" fill="currentColor"/>
        <line x1="480" y1="276" x2="480" y2="350" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        <line x1="280" y1="307" x2="280" y2="350" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        """
    elif "wheel" in slug or "bridge" in slug or "backbend" in category.lower():
        # High arch / bridge shape
        return """
        <path d="M 280 360 Q 400 160 520 360" stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round"/>
        <circle cx="260" cy="360" r="20" fill="currentColor"/>
        """
    elif "headstand" in slug or "handstand" in slug or "inversion" in category.lower():
        # Upside down vertical line
        return """
        <line x1="400" y1="350" x2="400" y2="210" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>
        <circle cx="400" cy="375" r="22" fill="currentColor"/>
        <path d="M 400 340 L 360 380 M 400 340 L 440 380" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
        """
    else:
        # Default dynamic posture silhouette
        return """
        <line x1="400" y1="360" x2="400" y2="240" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
        <path d="M 400 360 L 340 400 M 400 360 L 460 400" stroke="currentColor" stroke-width="12" stroke-linecap="round"/>
        <circle cx="400" cy="190" r="22" fill="currentColor"/>
        <path d="M 400 240 Q 320 200 350 140 M 400 240 Q 480 200 450 140" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round"/>
        """

generated_count = 0
for pose in CURATED_POSES:
    slug = pose["slug"]
    name = pose["name"]
    sanskrit = pose.get("sanskrit_name", "")
    category = pose.get("category", "Standing")
    difficulty = pose.get("difficulty", "Beginner")
    body_target = pose.get("body_target", "Full Body")

    style = CATEGORY_STYLES.get(category, CATEGORY_STYLES["Standing"])
    bg1 = style["bg1"]
    bg2 = style["bg2"]
    accent = style["accent"]
    glow = style["glow"]
    emoji = style["emoji"]

    paths = get_pose_paths(slug, category)

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{bg1}"/>
      <stop offset="100%" stop-color="{bg2}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="{glow}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{accent}"/>
      <stop offset="100%" stop-color="{glow}"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="800" height="600" fill="url(#bgGrad)"/>
  
  <!-- Ambient Center Glow -->
  <circle cx="400" cy="270" r="260" fill="url(#glowGrad)"/>

  <!-- Decorative Sacred Geometric Ring -->
  <circle cx="400" cy="270" r="190" fill="none" stroke="{accent}" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.4"/>
  <circle cx="400" cy="270" r="230" fill="none" stroke="{glow}" stroke-width="1" stroke-dasharray="2 12" opacity="0.3"/>

  <!-- Top Category & Stance Badge -->
  <g transform="translate(40, 45)">
    <rect x="0" y="0" width="160" height="34" rx="17" fill="{accent}" fill-opacity="0.15" stroke="{accent}" stroke-opacity="0.4" stroke-width="1.5"/>
    <text x="20" y="22" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="{glow}" letter-spacing="1.5">{emoji} {category.upper()}</text>
  </g>

  <!-- Top Right Difficulty Badge -->
  <g transform="translate(620, 45)">
    <rect x="0" y="0" width="140" height="34" rx="17" fill="#ffffff" fill-opacity="0.06" stroke="#ffffff" stroke-opacity="0.15" stroke-width="1.5"/>
    <text x="70" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#e2e8f0" text-anchor="middle">{difficulty}</text>
  </g>

  <!-- Central Posture Figure Vector Graphic -->
  <g fill="none" stroke="{accent}" style="color: {accent}; filter: url(#shadow);">
    {paths}
  </g>

  <!-- Chakra Energy Node Accents -->
  <circle cx="400" cy="270" r="6" fill="{glow}" opacity="0.9"/>
  <circle cx="400" cy="270" r="14" fill="none" stroke="{glow}" stroke-width="2" opacity="0.6"/>

  <!-- Bottom Information Bar -->
  <rect x="0" y="470" width="800" height="130" fill="#060c0a" fill-opacity="0.75"/>
  <line x1="0" y1="470" x2="800" y2="470" stroke="{accent}" stroke-opacity="0.3" stroke-width="1"/>

  <!-- Pose Title & Sanskrit Name -->
  <text x="50" y="522" font-family="Georgia, serif" font-size="30" font-weight="bold" fill="#ffffff">{name}</text>
  <text x="50" y="555" font-family="system-ui, sans-serif" font-size="16" font-style="italic" fill="{glow}">{sanskrit or name}</text>

  <!-- Body Target Badge -->
  <g transform="translate(600, 508)">
    <rect x="0" y="0" width="150" height="36" rx="12" fill="{accent}" fill-opacity="0.2" stroke="{accent}" stroke-width="1"/>
    <text x="75" y="23" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#ffffff" text-anchor="middle">🎯 {body_target}</text>
  </g>
</svg>"""

    file_path = output_dir / f"{slug}.svg"
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(svg_content.strip())

    generated_count += 1

print(f"Successfully generated {generated_count} distinct pose SVG artwork files in {output_dir}!")
