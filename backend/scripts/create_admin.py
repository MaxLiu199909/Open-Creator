import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, engine
from app.models import User, Base
from app.auth import get_password_hash

def create_admin(email: str, password: str):
    logger.info(f"Creating/updating admin user with email: {email}")

    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            logger.info(f"User {email} found, updating admin status")
            user.is_admin = True
            user.hashed_password = get_password_hash(password)
            user.auth_provider = "email"
            db.commit()
            logger.info('Admin status and password updated successfully')
        else:
            logger.info(f"Creating new admin user: {email}")
            new_user = User(
                email=email,
                name="Admin User",
                hashed_password=get_password_hash(password),
                is_admin=True,
                auth_provider="email"
            )
            db.add(new_user)
            db.commit()
            logger.info('Admin user created successfully')
    except Exception as e:
        logger.error(f"Error creating/updating admin user: {str(e)}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <email> <password>")
        sys.exit(1)
    create_admin(sys.argv[1], sys.argv[2])
