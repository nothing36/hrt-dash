"""
FastAPI application factory
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

def create_app() -> FastAPI:

    app = FastAPI(
        title="hrt-backend API",
        description="Not for medical use. Purely educational.",
        version="0.1.0",
    )

    # adjust later for prod
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # attach routes
    app.include_router(router)
    return app

app = create_app()