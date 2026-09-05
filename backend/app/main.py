from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import api_router

app = FastAPI(
    title="Creative Intelligence OS API",
    description="Agentic workspace & DAG execution engine for creative strategy",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 API endpoints
app.include_router(api_router, prefix="/api/v1")


@app.get("/healthz", status_code=200)
async def health_check():
    """Health check endpoint for operational verification."""
    return {"status": "healthy", "version": "1.0.0"}


@app.get("/")
async def root():
    """Root metadata endpoint."""
    return {
        "name": "Creative Intelligence OS API",
        "status": "operational",
        "docs": "/docs",
    }
