# 🧘 YOGA LIFE — Full-Stack 3D Yoga Platform

> **Tagline:** *Learn. Breathe. Practice. Transform.*

**Yoga Life** is a full-stack, 3D Yoga Awareness, Personalized Guided Practice, Progress Tracking, and 30-Day Transformation Journey platform.

---

## 🌟 Key Highlights & Features

### 1. 🧘 3D Landing Page & Immersion
- **Three.js & React Three Fiber** serene 3D scene with an avatar meditating on a yoga mat, low-poly mountains, atmospheric sunrise glow, and floating golden energy particles.
- Graceful 2D/CSS fallback if WebGL is unavailable on older hardware.

### 2. 🔐 Real Multi-Method Authentication
- **Email + Password** with bcrypt hashing & JWT tokens.
- **Google OAuth** authentication support.
- **Phone OTP Login** with live countdown timer, expiration, rate limiting, and resend OTP support.
- **Session & Device Activity Logging** tracking timestamps and client info.

### 3. 🎯 4-Step Interactive Onboarding
- **Step 1:** Goal Selection (Relaxation, Focus, Flexibility, Strength, Better Sleep, Energy, General Wellness)
- **Step 2:** Experience Level (Beginner, Intermediate, Advanced)
- **Step 3:** Daily Commitment (5, 10, 15, 30, 45, 60 minutes)
- **Step 4:** Preferred Practice Time (Morning, Afternoon, Evening, Flexible)

### 4. 📚 Yoga Awareness Hub
- **What is Yoga?** Meaning, 5,000+ year history, philosophy, and modern integration.
- **The Eight Limbs of Yoga (Ashtanga):** Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi.
- **Types of Yoga:** Hatha, Vinyasa, Ashtanga, Yin, Restorative, Kundalini, Pranayama, Meditation.
- **Daily "Did You Know?"** with daily rotating articles and **"Mark as Learned"** progress tracking.

### 5. 🔍 Yoga Library (Kaggle Dataset + Curated Poses)
- Live search by English name, Sanskrit name (e.g. *Vrikshasana*, *Virabhadrasana*), category, or body target.
- Filters: Standing, Sitting, Balancing, Backbend, Twisting, Restorative.
- Detailed Pose view with instructions, health benefits, breathing guidance, safety notes, 3D mannequin visualizer, and 1-click favorites.

### 6. ⏱️ Guided Practice Mode
- Large legible countdown timer designed for visibility from across the room.
- Pose side indicator (Left Side / Right Side).
- **Web Audio API** synthesized Tibetan singing bowl chimes and countdown ticks.
- Dynamic **Pranayama Breathing Visualizer** (Inhale • Hold • Exhale).
- Pause, Resume, Next, Previous, and Skip controls.
- Rest interval countdown between poses.

### 7. 🏆 30-Day Yoga Journey Progression Engine
- **Day 1 → 🌱 Beginner Badge:** Awarded upon first practice.
- **Day 7 → 🔥 Consistency Badge:** Awarded after 7 unique practice days.
- **Day 14 → 🤸 Flexibility Journey:** Unlocks specialized mobility and hamstring flows.
- **Day 30 → 🏆 Yoga Life Champion:** Gold masterclass milestone celebration with animated badges.
- Progression is strictly based on **real unique practice days** (never calendar skipping).

### 8. 📊 Analytics & Practice Graph
- Interactive charts (Minutes vs. Days) across 7-day and 30-day horizons.
- Key metrics: Total practice hours, average session minutes, total sessions, total days, and streak record.
- Encouraging weekly non-medical feedback.

### 9. 🤖 AI Yoga Assistant (RAG Architecture)
- Grounded in the verified Yoga Life knowledge base (poses, breathing cues, safety precautions, philosophy).
- Cites grounded sources and returns structured suggested poses from the library.
- Includes clear health & wellness disclaimers.

### 10. 📝 Personal Yoga Journal & Mood Tracking
- Post-session mood selection (😊 Great, 🙂 Good, 😌 Relaxed, 😐 Okay, 😴 Tired).
- Energy level slider (1–10).
- Reflection notes timeline.

### 11. 🛡️ Admin Operations Panel
- Manage yoga poses (Create, Update, Delete).
- Platform metrics overview (Total Users, Sessions, Poses, Articles, Hours).

---

## 🏗️ Architecture & Tech Stack

```text
Frontend
├── React 18 (Vite)
├── Tailwind CSS (Wellness Emerald / Amber Theme)
├── Three.js & React Three Fiber / Drei
├── Lucide React Icons
├── Recharts (Analytics Graphs)
└── Canvas Confetti (Milestone Celebrations)

Backend
├── FastAPI (Python 3.10+)
├── SQLAlchemy (ORM & Models)
├── SQLite (Default out-of-the-box) / PostgreSQL Ready
├── Direct Bcrypt Password Hashing & PyJWT
└── RAG Grounded Knowledge Engine

Dataset
└── Kaggle Yoga Poses Dataset ('niharika41298/yoga-poses-dataset') + Curated Canonical Asana Library
```

---

## 🗄️ Database Schema

The database includes 23 structured tables with foreign keys and indexes:
1. `users` — Authentication & credentials
2. `profiles` — User goals, experience, duration, onboarding status
3. `user_sessions` — Login session activity & device tracking
4. `phone_otps` — Verification codes with expiration
5. `oauth_accounts` — Google / 3rd-party OAuth records
6. `yoga_categories` — Types of yoga & descriptions
7. `yoga_poses` — Full pose library (Sanskrit name, instructions, benefits, safety, cues)
8. `custom_routines` — User-created flow sequences
9. `yoga_sessions` — Completed practice workouts
10. `session_poses` — Individual pose logs in a workout
11. `practice_history` — Aggregated daily practice records
12. `streaks` — Current streak, longest streak, total practice days
13. `journey_milestones` — Day 1, 7, 14, 30 milestone definitions
14. `journey_progress` — User milestone unlocking state
15. `achievements` — Platform badge definitions
16. `user_achievements` — Unlocked user badges with timestamps
17. `awareness_articles` — Philosophy, anatomy, and breathing articles
18. `awareness_progress` — User article completion tracking
19. `favorites` — Bookmarked poses and routines
20. `journal_entries` — Mood, energy, reflections
21. `reminders` — Daily practice notification preferences

---

## 🚀 Quick Start Guide (Run Locally in 2 Minutes)

### Option 1: One-Click Runner (Windows)
Double-click `run_app.bat` in the project root. It will automatically start both the backend and frontend dev servers.

### Option 2: Manual Startup

#### 1. Backend Startup:
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API is running at: **`http://localhost:8000`**
- Interactive Swagger API Docs: **`http://localhost:8000/docs`**

#### 2. Frontend Startup:
```bash
cd frontend
npm install
npm run dev
```
- Web Application is running at: **`http://localhost:5173`**

---

## 🔑 Demo Accounts (For Instant Evaluation)

| Role | Email | Password |
|---|---|---|
| **Master Admin** | `admin@yogalife.app` | `YogaLifeAdmin2026!` |
| **Yogi Member** | `yogi.mindful@gmail.com` | `yoga123456` |
| **Phone OTP Demo** | `+1 (555) 000-1234` | Code: `123456` or live generated OTP |

---

## 📥 Kaggle Dataset Download Script

To inspect and import the Kaggle yoga poses dataset into your local database:
```bash
cd backend
python app/scripts/import_kaggle_dataset.py
```
