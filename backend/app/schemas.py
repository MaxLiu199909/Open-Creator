from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: Optional[str] = None
    auth_provider: str

class UserLogin(BaseModel):
    email: EmailStr
    password: Optional[str] = None
    provider: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str
    is_admin: bool = False

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class GalleryBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class GalleryCreate(GalleryBase):
    pass

class GalleryResponse(GalleryBase):
    id: int
    author_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int
    owner_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
