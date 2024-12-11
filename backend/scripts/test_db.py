import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import inspect
from app.database import engine, SessionLocal
from app.models import Base, User

def test_database_connection():
    logger.info("Testing database connection...")
    try:
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to database")

            # Get existing tables
            inspector = inspect(engine)
            existing_tables = inspector.get_table_names()
            logger.info(f"Existing tables: {existing_tables}")

            # Create tables if they don't exist
            Base.metadata.create_all(bind=engine)
            logger.info("Ensured all tables exist")

            # Test User table
            db = SessionLocal()
            try:
                users = db.query(User).all()
                logger.info(f"Found {len(users)} users in database")
                for user in users:
                    logger.info(f"User: {user.email}, Admin: {user.is_admin}")
            finally:
                db.close()

    except Exception as e:
        logger.error(f"Database connection error: {str(e)}")
        raise

if __name__ == "__main__":
    test_database_connection()
