from pydantic import BaseModel
from typing import Optional, List
from enum import Enum

# --- MAPS ---
class CustomCoords(BaseModel):
    lat: float
    lng: float
    name: str

class ResolveMapsRequest(BaseModel):
    maps_url: str
    origin_station_id: Optional[str] = None
    custom_origin_coords: Optional[CustomCoords] = None

# --- CALC ---
class FireShape(str, Enum):
    CIRCLE = "circle"
    SEMICIRCLE = "semicircle"
    QUARTER = "quarter"
    RECTANGLE = "rectangle"

class PcccCalcRequest(BaseModel):
    material_type: str = "wood"
    time_free_burn_minutes: float = 10.0
    fire_shape: FireShape = FireShape.CIRCLE
    room_length_m: Optional[float] = None
    room_width_m: Optional[float] = None
    nozzle_type: str = "nozzle_B"

# --- LLM AI ---
class FacilityFloor(BaseModel):
    name: str
    function: str

class FacilityInfo(BaseModel):
    name: str
    business_type: str
    address: str
    area_m2: float
    floors: List[FacilityFloor] = []

class FullGenerationRequest(BaseModel):
    facility: FacilityInfo
    calc_params: PcccCalcRequest
    station_name: str
    route_description: str

class SectionGenerationRequest(BaseModel):
    full_context: FullGenerationRequest
    section_key: str

class RefineSectionRequest(BaseModel):
    current_text: str
    instruction: str
