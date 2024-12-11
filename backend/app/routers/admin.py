from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[schemas.UserResponse])
async def list_users(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(models.User).all()
    return users

@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own admin account"
        )
    db.delete(user)
    db.commit()
    return None

@router.put("/users/{user_id}/toggle-admin")
async def toggle_admin_status(
    user_id: int,
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if user.id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify your own admin status"
        )
    user.is_admin = not user.is_admin
    db.commit()
    db.refresh(user)
    return user

@router.get("/dashboard")
async def get_dashboard(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    stats = await get_dashboard_stats(current_admin, db)
    return {
        "message": "Welcome to Admin Dashboard",
        "admin": {
            "email": current_admin.email,
            "name": current_admin.name
        },
        "stats": stats
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    current_admin: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(models.User).count()
    total_galleries = db.query(models.Gallery).count()
    total_projects = db.query(models.Project).count()

    return {
        "total_users": total_users,
        "total_galleries": total_galleries,
        "total_projects": total_projects,
        "recent_users": db.query(models.User).order_by(models.User.created_at.desc()).limit(5).all(),
        "recent_galleries": db.query(models.Gallery).order_by(models.Gallery.created_at.desc()).limit(5).all(),
        "recent_projects": db.query(models.Project).order_by(models.Project.created_at.desc()).limit(5).all()
    }
