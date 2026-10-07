@echo off
title YOGA LIFE — Full-Stack Platform
echo ========================================================
echo        🧘 YOGA LIFE — Learn. Breathe. Practice. Transform.
echo ========================================================
echo.
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "Yoga Life Backend" cmd /k "cd backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "Yoga Life Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Yoga Life platform launched!
echo 🌐 Frontend: http://localhost:5173
echo 📡 Backend API & Interactive Docs: http://localhost:8000/docs
echo.
pause
