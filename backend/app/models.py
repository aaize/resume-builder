from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String)

    full_name = Column(String)
    email = Column(String)
    phone = Column(String)

    skills = Column(String)
    education = Column(String)
    experience = Column(String)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )