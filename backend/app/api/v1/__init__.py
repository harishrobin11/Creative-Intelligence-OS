from fastapi import APIRouter
from app.api.v1.endpoints import extraction, graphs, stream

api_router = APIRouter()
api_router.include_router(extraction.router, tags=["extraction"])
api_router.include_router(graphs.router, tags=["graphs"])
api_router.include_router(stream.router, tags=["stream"])
