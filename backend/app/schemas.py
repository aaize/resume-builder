from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ResumeCreate(BaseModel):
    title: str
    full_name: str
    email: str
    phone: str
    skills: str
    education: str
    experience: str