from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone_number: Optional[str] = None
    password: str = Field(..., min_length=6)
    confirm_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    token: str
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None

class PhoneSendOTP(BaseModel):
    phone_number: str = Field(..., min_length=8, max_length=20)

class PhoneVerifyOTP(BaseModel):
    phone_number: str
    otp_code: str
    full_name: Optional[str] = "Yoga Practitioner"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserSessionOut(BaseModel):
    id: int
    login_time: datetime
    ip_address: Optional[str]
    device_info: Optional[str]
    user_agent: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
