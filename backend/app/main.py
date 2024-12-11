from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse
import psycopg
from .database import engine
from . import models
from .routers import auth, gallery, projects, admin
import uvicorn
import asyncio
import os

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Keep-alive task
async def keep_alive():
    while True:
        await asyncio.sleep(30)  # Ping every 30 seconds

app = FastAPI(
    title="Open Creator API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    redirect_slashes=False
)

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Start keep-alive task
@app.on_event("startup")
async def startup_event():
    background_tasks = BackgroundTasks()
    background_tasks.add_task(keep_alive)

# Include routers first
app.include_router(auth.router)
app.include_router(gallery.router)
app.include_router(projects.router)
app.include_router(admin.router)

# Health check endpoint
@app.get("/healthz")
@app.get("/healthz/")
async def healthz():
    return {"status": "healthy"}

# Admin dashboard endpoints
@app.get("/admin/dashboard/")
@app.get("/admin/dashboard")
async def serve_admin(request: Request):
    return FileResponse("app/static/admin/index.html")

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to Open Creator API"}

# Mount static files for admin dashboard assets
app.mount("/static", StaticFiles(directory="app/static"), name="static")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        workers=4,
        limit_concurrency=100,
    )
