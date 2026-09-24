from fastapi import APIRouter
from app.api.endpoints import maps, pccc_calc, document

api_router = APIRouter()

api_router.include_router(maps.router, prefix="/maps", tags=["maps"])
api_router.include_router(pccc_calc.router, prefix="/pccc_calc", tags=["pccc_calc"])
api_router.include_router(document.router, prefix="/document", tags=["document"])
