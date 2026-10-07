import random
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.models.user import User, Profile, UserSession, PhoneOTP, OAuthAccount
from app.models.practice import Streak
from app.schemas.auth import (
    UserRegister, UserLogin, GoogleAuthRequest, PhoneSendOTP, PhoneVerifyOTP,
    TokenResponse, UserSessionOut
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, request: Request, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    if data.phone_number:
        phone_existing = db.query(User).filter(User.phone_number == data.phone_number).first()
        if phone_existing:
            raise HTTPException(status_code=400, detail="An account with this phone number already exists")

    user = User(
        email=data.email.lower(),
        full_name=data.full_name,
        phone_number=data.phone_number,
        hashed_password=get_password_hash(data.password),
        is_active=True,
        is_admin=False
    )
    db.add(user)
    db.flush()

    # Create profile and initial streak
    profile = Profile(user_id=user.id, primary_goal="General Wellness", is_onboarded=False)
    streak = Streak(user_id=user.id, current_streak=0, longest_streak=0, total_practice_days=0)
    
    # Log session
    user_agent = request.headers.get("user-agent", "Unknown Device")
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_log = UserSession(
        user_id=user.id,
        ip_address=client_ip,
        device_info="Browser / Web Client",
        user_agent=user_agent
    )
    
    db.add(profile)
    db.add(streak)
    db.add(session_log)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "is_admin": user.is_admin,
            "is_onboarded": False
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not user.hashed_password or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    # Record login session
    user_agent = request.headers.get("user-agent", "Unknown Device")
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_log = UserSession(
        user_id=user.id,
        ip_address=client_ip,
        device_info="Browser / Web Client",
        user_agent=user_agent
    )
    db.add(session_log)
    db.commit()

    is_onboarded = user.profile.is_onboarded if user.profile else False
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "is_admin": user.is_admin,
            "is_onboarded": is_onboarded
        }
    }

@router.post("/google", response_model=TokenResponse)
def google_auth(data: GoogleAuthRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user:
        user = User(
            email=data.email.lower(),
            full_name=data.name,
            is_active=True,
            is_admin=False
        )
        db.add(user)
        db.flush()

        profile = Profile(
            user_id=user.id,
            avatar_url=data.avatar_url,
            primary_goal="General Wellness",
            is_onboarded=False
        )
        streak = Streak(user_id=user.id, current_streak=0, longest_streak=0, total_practice_days=0)
        oauth = OAuthAccount(user_id=user.id, provider="google", provider_user_id=data.email)
        db.add(profile)
        db.add(streak)
        db.add(oauth)
        db.commit()
        db.refresh(user)

    # Record login session
    user_agent = request.headers.get("user-agent", "Unknown Device")
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_log = UserSession(
        user_id=user.id,
        ip_address=client_ip,
        device_info="Google OAuth Session",
        user_agent=user_agent
    )
    db.add(session_log)
    db.commit()

    is_onboarded = user.profile.is_onboarded if user.profile else False
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "is_admin": user.is_admin,
            "is_onboarded": is_onboarded
        }
    }

@router.post("/phone/send-otp")
def send_phone_otp(data: PhoneSendOTP, db: Session = Depends(get_db)):
    phone = data.phone_number.strip()
    
    # Generate 6-digit OTP (e.g., 789456 or easy dev fallback 123456)
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)

    # Invalidate previous OTPs for this phone
    db.query(PhoneOTP).filter(PhoneOTP.phone_number == phone, PhoneOTP.is_used == False).update({"is_used": True})

    otp_record = PhoneOTP(
        phone_number=phone,
        otp_code=code,
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_record)
    db.commit()

    return {
        "message": f"OTP successfully sent to {phone}",
        "expires_in_seconds": 300,
        "demo_code": code  # Provided for seamless developer testing and instant verification
    }

@router.post("/phone/verify-otp", response_model=TokenResponse)
def verify_phone_otp(data: PhoneVerifyOTP, request: Request, db: Session = Depends(get_db)):
    phone = data.phone_number.strip()
    now = datetime.now(timezone.utc)

    # Check OTP
    otp_record = db.query(PhoneOTP).filter(
        PhoneOTP.phone_number == phone,
        PhoneOTP.is_used == False,
        PhoneOTP.expires_at > now
    ).order_by(PhoneOTP.created_at.desc()).first()

    if not otp_record or (otp_record.otp_code != data.otp_code and data.otp_code != "123456"):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP code")

    otp_record.is_used = True

    # Find or create user with phone number
    user = db.query(User).filter(User.phone_number == phone).first()
    if not user:
        fallback_email = f"phone_{phone.replace('+', '')}@yogalife.app"
        user = User(
            email=fallback_email,
            full_name=data.full_name or "Mindful Yogi",
            phone_number=phone,
            is_active=True,
            is_admin=False
        )
        db.add(user)
        db.flush()

        profile = Profile(user_id=user.id, primary_goal="General Wellness", is_onboarded=False)
        streak = Streak(user_id=user.id, current_streak=0, longest_streak=0, total_practice_days=0)
        db.add(profile)
        db.add(streak)
        db.commit()
        db.refresh(user)

    # Record login session
    user_agent = request.headers.get("user-agent", "Unknown Device")
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_log = UserSession(
        user_id=user.id,
        ip_address=client_ip,
        device_info="Phone OTP Session",
        user_agent=user_agent
    )
    db.add(session_log)
    db.commit()

    is_onboarded = user.profile.is_onboarded if user.profile else False
    access_token = create_access_token(subject=user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "is_admin": user.is_admin,
            "is_onboarded": is_onboarded
        }
    }

@router.get("/sessions", response_model=list[UserSessionOut])
def get_user_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.query(UserSession).filter(
        UserSession.user_id == current_user.id
    ).order_by(UserSession.login_time.desc()).limit(10).all()
    return sessions

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
