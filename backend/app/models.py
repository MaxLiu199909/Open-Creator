from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    auth_provider = Column(String)
    hashed_password = Column(String, nullable=True)  # For email auth
    is_admin = Column(Boolean, default=False)  # For admin dashboard access
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    galleries = relationship("Gallery", back_populates="author")
    projects = relationship("Project", back_populates="owner")

class Gallery(Base):
    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text, nullable=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author = relationship("User", back_populates="galleries")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    description = Column(Text)
    image_url = Column(String)
    status = Column(String)  # For tracking project status
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    owner = relationship("User", back_populates="projects")
