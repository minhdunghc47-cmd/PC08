from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.input_schema import ResolveMapsRequest
from app.schemas.output_schema import ResolveMapsResponse, StationResponse
from app.services import maps_service

router = APIRouter()

@router.get("/stations", response_model=List[StationResponse])
def get_stations():
    """
    Lấy danh sách các Đội Cảnh sát PCCC mặc định.
    """
    return maps_service.get_stations()

@router.post("/resolve", response_model=ResolveMapsResponse)
def resolve_maps_url(request: ResolveMapsRequest):
    """
    Giải mã URL Google Maps, lấy tọa độ và tính toán lộ trình từ trạm PCCC đến cơ sở.
    """
    try:
        custom_coords = request.custom_origin_coords.model_dump() if request.custom_origin_coords else None
    except AttributeError:
        custom_coords = request.custom_origin_coords.dict() if request.custom_origin_coords else None
        
    try:
        result = maps_service.resolve_maps(
            url=request.maps_url,
            origin_station_id=request.origin_station_id,
            custom_coords=custom_coords
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
