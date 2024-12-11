from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(prefix="/gallery", tags=["gallery"])

@router.get("/", response_model=List[schemas.GalleryResponse])
async def list_gallery_items(db: Session = Depends(get_db)):
    items = db.query(models.Gallery).all()
    return items

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_gallery_item(
    item: schemas.GalleryCreate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    new_item = models.Gallery(
        title=item.title,
        description=item.description,
        author_id=current_user.id,
        image_url=item.image_url if item.image_url else "default.jpg"
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/{gallery_id}", response_model=schemas.GalleryResponse)
async def get_gallery_item(gallery_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Gallery).filter(models.Gallery.id == gallery_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    return item

@router.delete("/{gallery_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_item(
    gallery_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    item = db.query(models.Gallery).filter(models.Gallery.id == gallery_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gallery item not found"
        )
    if item.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item"
        )
    db.delete(item)
    db.commit()
    return None
