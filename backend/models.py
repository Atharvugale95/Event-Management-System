from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from database import Base

class Event(Base):
    __tablename__ = "events"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String, nullable=False)
    description      = Column(String, nullable=True)
    venue            = Column(String, nullable=False)
    date_time        = Column(String, nullable=False)
    entry_fee        = Column(Float, default=0.0)
    max_participants = Column(Integer, default=100)
    poster_url       = Column(String, nullable=True)
    created_by       = Column(String, nullable=False)
    created_at       = Column(DateTime, default=datetime.utcnow)

    # ✅ not stored in DB — calculated at runtime per request
    registered_count: int = 0

class Registration(Base):
    __tablename__ = "registrations"

    id          = Column(Integer, primary_key=True, index=True)
    participant = Column(String, nullable=False)
    phone       = Column(String, nullable=False)
    email       = Column(String, nullable=False)
    college     = Column(String, nullable=True)
    event_id    = Column(Integer, nullable=True)
    event_name  = Column(String, default="Sports Festival 2026")
    fee         = Column(String, default="INR 0.00")
    status      = Column(String, default="Confirmed")
    created_at  = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id       = Column(Integer, primary_key=True, index=True)
    email    = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role     = Column(String, default="guest")