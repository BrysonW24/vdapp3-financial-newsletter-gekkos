"""FastAPI application initialization and router registration."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.routers import (
    daily,
    portfolio,
    youtube,
    commodities,
    venture_capital,
)

# Initialize FastAPI application
app = FastAPI(
    title="Gekkos Financial Intelligence API",
    description="Multi-featured financial intelligence platform with portfolio tracking, commodities, and VC insights",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if hasattr(settings, 'CORS_ORIGINS') else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment verification."""
    return {
        "status": "healthy",
        "service": "Gekkos Financial Intelligence API",
        "version": "1.0.0",
    }


# Register routers
app.include_router(daily.router)
app.include_router(portfolio.router)
app.include_router(youtube.router)
app.include_router(commodities.router)
app.include_router(venture_capital.router)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handle global exceptions with standardized error responses."""
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG if hasattr(settings, 'DEBUG') else True,
    )
