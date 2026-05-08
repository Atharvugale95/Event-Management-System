from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    venue: str
    date_time: str
    entry_fee: float = 0.0
    max_participants: int = 100
    poster_url: Optional[str] = None

class EventUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    venue: Optional[str] = None
    date_time: Optional[str] = None
    entry_fee: Optional[float] = None
    max_participants: Optional[int] = None
    poster_url: Optional[str] = None

class EventResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    venue: str
    date_time: str
    entry_fee: float
    max_participants: int
    registered_count: int = 0   # ✅ capacity info
    poster_url: Optional[str]
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True

class RegistrationCreate(BaseModel):
    participant: str
    phone: str
    email: str
    college: str
    event_id: int

class RegistrationResponse(BaseModel):
    id: int
    participant: str
    phone: str
    email: str
    college: Optional[str]
    event_id: Optional[int]
    event_name: str
    fee: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "guest"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    email: str
    role: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True