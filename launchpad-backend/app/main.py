from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import auth, modules, tasks, progress

settings = get_settings()

app = FastAPI(
    title="Launchpad API",
    description="Your adult life setup headquarters",
    version="1.0.0",
    debug=settings.DEBUG
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(modules.router, prefix="/api/v1")
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Welcome to Launchpad API",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
