from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import bcrypt, os, shutil, uuid

import models
import schemas
from database import engine, SessionLocal
from auth import create_access_token, get_current_user, require_role

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8")[:72], bcrypt.gensalt()
    ).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode("utf-8")[:72],
        hashed.encode("utf-8")
    )

# ✅ helper — attach registration count to event object
def attach_count(event, db):
    event.registered_count = db.query(models.Registration).filter(
        models.Registration.event_id == event.id
    ).count()
    return event

# ─────────────────────────────────────────
# AUTH ROUTES
# ─────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "FastAPI server is running!"}

@app.post("/register-user")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    if user.role not in ["admin", "organizer", "guest"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = models.User(
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )
    db.add(new_user)
    db.commit()
    return {"message": f"Account created as {user.role}!"}

@app.post("/login-user", response_model=schemas.TokenResponse)
def login_user(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(email=db_user.email, role=db_user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": db_user.email,
        "role": db_user.role
    }

# ─────────────────────────────────────────
# POSTER UPLOAD
# ─────────────────────────────────────────

@app.post("/upload-poster")
def upload_poster(
    file: UploadFile = File(...),
    current_user: models.User = Depends(require_role("admin", "organizer"))
):
    allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, WEBP or GIF images allowed")

    ext      = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"uploads/{filename}"

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"poster_url": f"http://localhost:8000/uploads/{filename}"}

# ─────────────────────────────────────────
# EVENT ROUTES
# ────────────────────────────────────────
# GET /events — 
@app.get("/events", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    for event in events:
        attach_count(event, db)  
    return events


@app.get("/events/{id}", response_model=schemas.EventResponse)
def get_event(id: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    attach_count(event, db)  # ✅ inject count
    return event

# POST /events — create event
@app.post("/events", response_model=schemas.EventResponse)
def create_event(
    data: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "organizer"))
):
    new_event = models.Event(
        name=data.name,
        description=data.description,
        venue=data.venue,
        date_time=data.date_time,
        entry_fee=data.entry_fee,
        max_participants=data.max_participants,
        poster_url=data.poster_url,
        created_by=current_user.email
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    attach_count(new_event, db)
    return new_event

# PUT /events/{id} — update event
@app.put("/events/{id}", response_model=schemas.EventResponse)
def update_event(
    id: int,
    data: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "organizer"))
):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if current_user.role == "organizer" and event.created_by != current_user.email:
        raise HTTPException(status_code=403, detail="You can only edit events you created")

    if data.name is not None:             event.name = data.name
    if data.description is not None:      event.description = data.description
    if data.venue is not None:            event.venue = data.venue
    if data.date_time is not None:        event.date_time = data.date_time
    if data.entry_fee is not None:        event.entry_fee = data.entry_fee
    if data.max_participants is not None: event.max_participants = data.max_participants
    if data.poster_url is not None:       event.poster_url = data.poster_url

    db.commit()
    db.refresh(event)
    attach_count(event, db)
    return event

# DELETE /events/{id}
@app.delete("/events/{id}")
def delete_event(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin", "organizer"))
):
    event = db.query(models.Event).filter(models.Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if current_user.role == "organizer" and event.created_by != current_user.email:
        raise HTTPException(status_code=403, detail="You can only delete events you created")

    if event.poster_url and "/uploads/" in event.poster_url:
        filename = event.poster_url.split("/uploads/")[-1]
        filepath = f"uploads/{filename}"
        if os.path.exists(filepath):
            os.remove(filepath)

    db.delete(event)
    db.commit()
    return {"message": f"Event '{event.name}' deleted"}

# ─────────────────────────────────────────
# REGISTRATION ROUTES
# ─────────────────────────────────────────

@app.post("/register", response_model=schemas.RegistrationResponse)
def register(
    data: schemas.RegistrationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("guest", "admin"))
):
    event = db.query(models.Event).filter(models.Event.id == data.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    count = db.query(models.Registration).filter(
        models.Registration.event_id == data.event_id
    ).count()
    if count >= event.max_participants:
        raise HTTPException(status_code=400, detail="Event is full!")

    existing = db.query(models.Registration).filter(
        models.Registration.email == data.email,
        models.Registration.event_id == data.event_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event!")

    new_reg = models.Registration(
        participant=data.participant,
        phone=data.phone,
        email=data.email,
        college=data.college,
        event_id=data.event_id,
        event_name=event.name,
        fee=f"INR {event.entry_fee:.2f}",
    )
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return new_reg

@app.get("/registrations", response_model=list[schemas.RegistrationResponse])
def get_registrations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("organizer", "admin"))
):
    return db.query(models.Registration).all()

@app.get("/registrations/event/{event_id}", response_model=list[schemas.RegistrationResponse])
def get_registrations_by_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("organizer", "admin"))
):
    return db.query(models.Registration).filter(
        models.Registration.event_id == event_id
    ).all()

@app.delete("/registrations/{id}")
def delete_registration(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    reg = db.query(models.Registration).filter(models.Registration.id == id).first()
    if not reg:
        raise HTTPException(status_code=404, detail="Registration not found")
    db.delete(reg)
    db.commit()
    return {"message": "Registration deleted"}

@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    return db.query(models.User).all()

@app.delete("/users/{id}")
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("admin"))
):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}