from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

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


@app.get("/")
def root():
    return {
        "message": "Welcome to Launchpad API",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
