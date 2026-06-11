from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from .database import engine, SessionLocal
from . import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Resume Builder API Running again"}


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    hashed_password = auth.hash_password(user.password)

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user_id": new_user.id
    }
@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == form_data.username
    ).first()

    if not existing_user:
        return {"error": "Invalid email"}

    valid_password = auth.verify_password(
        form_data.password,
        existing_user.password
    )

    if not valid_password:
        return {"error": "Invalid password"}

    access_token = auth.create_access_token(
        data={"user_id": existing_user.id}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@app.get("/profile")
def profile(current_user: int = Depends(auth.get_current_user)):
    return {
        "message": "Protected route working",
        "user_id": current_user
    }


@app.post("/resume")
def create_resume(
    resume: schemas.ResumeCreate,
    current_user: int = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):

    new_resume = models.Resume(
        title=resume.title,
        full_name=resume.full_name,
        email=resume.email,
        phone=resume.phone,
        skills=resume.skills,
        education=resume.education,
        experience=resume.experience,
        user_id=current_user
    )

    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "message": "Resume created",
        "resume_id": new_resume.id
    }
@app.get("/resumes")
def get_resumes(
    current_user: int = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resumes = db.query(models.Resume).filter(
        models.Resume.user_id == current_user
    ).all()

    return resumes

@app.delete("/resume/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: int = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(
        models.Resume.id == resume_id,
        models.Resume.user_id == current_user
    ).first()

    if not resume:
        return {"error": "Resume not found"}

    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully"}