from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from datetime import timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    new_user = models.User(
        email=user.email,
        name=user.name,
        auth_provider=user.auth_provider,
        hashed_password=auth.get_password_hash(user.password) if user.password else None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    try:
        # Log login attempt
        logger.info(f"Login attempt for email: {user_credentials.email}")

        # Find user by email
        user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
        if not user:
            logger.warning(f"User not found: {user_credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify authentication based on provider
        if user_credentials.provider != user.auth_provider:
            logger.warning(f"Invalid provider: {user_credentials.provider} for user: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication provider",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if user_credentials.provider == "email":
            if not user.hashed_password or not user_credentials.password:
                logger.warning(f"Missing password for email authentication: {user.email}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Password is required for email authentication",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            if not auth.verify_password(user_credentials.password, user.hashed_password):
                logger.warning(f"Invalid password for user: {user.email}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
        elif user_credentials.provider in ["google", "apple"]:
            # For OAuth providers, we assume the token verification was done by the frontend
            pass
        else:
            logger.error(f"Invalid provider type: {user_credentials.provider}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid authentication provider"
            )

        # Create access token
        logger.info(f"Creating access token for user: {user.email}")
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email, "is_admin": user.is_admin},
            expires_delta=access_token_expires
        )

        logger.info(f"Login successful for user: {user.email}")
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise
