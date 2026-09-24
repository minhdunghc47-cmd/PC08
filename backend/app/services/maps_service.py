import re
import requests
from typing import Tuple, List, Dict, Optional
from app.core.config import settings
from app.core.constants import MOCK_FIRE_STATIONS

def extract_coordinates_from_url(url: str) -> Tuple[float, float]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers, allow_redirects=True, timeout=10)
        final_url = response.url
    except requests.RequestException:
        final_url = url
        
    match = re.search(r'@(-?\d+\.\d+),(-?\d+\.\d+)', final_url)
    if match:
        return float(match.group(1)), float(match.group(2))
        
    match = re.search(r'!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)', final_url)
    if match:
        return float(match.group(1)), float(match.group(2))
        
    match = re.search(r'[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)', final_url)
    if match:
        return float(match.group(1)), float(match.group(2))
        
    match = re.search(r'destination=(-?\d+\.\d+),(-?\d+\.\d+)', final_url)
    if match:
        return float(match.group(1)), float(match.group(2))
        
    raise ValueError("Không thể trích xuất tọa độ từ URL Google Maps này.")

def build_pc08_route_string(station_name: str, steps: List[str], distance_km: float) -> str:
    filtered_steps = []
    for step in steps:
        name = step.lower()
        name = name.replace("đi dọc theo", "").replace("rẽ trái vào", "").replace("rẽ phải vào", "").replace("đi tiếp vào", "").replace("đi vào", "").replace("vào", "")
        name = name.strip().title()
        
        if not name or name.lower() in ["", "unnamed road", "tuyến đường chưa biết tên", "turn left", "turn right", "continue"]:
            continue
            
        if not filtered_steps or filtered_steps[-1].lower() != name.lower():
            filtered_steps.append(name)
            
    route_path = " ➔ ".join(filtered_steps)
    if route_path:
        return f"{station_name} ➔ {route_path} ➔ Cơ sở ({distance_km:.1f} km)"
    return f"{station_name} ➔ Cơ sở ({distance_km:.1f} km)"

def get_osrm_route(lat1: float, lng1: float, lat2: float, lng2: float) -> Dict:
    url = f"http://router.project-osrm.org/route/v1/driving/{lng1},{lat1};{lng2},{lat2}?overview=false&steps=true"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()
    
    if data.get("code") != "Ok":
        raise ValueError("Không thể tính toán lộ trình bằng OSRM.")
        
    route = data["routes"][0]
    distance_km = route["distance"] / 1000.0
    duration_minutes = route["duration"] / 60.0
    
    raw_steps = []
    legs = route.get("legs", [])
    if legs:
        steps = legs[0].get("steps", [])
        for step in steps:
            name = step.get("name", "")
            if name:
                raw_steps.append(name)
                
    return {
        "distance_km": distance_km,
        "duration_minutes": duration_minutes,
        "raw_steps": raw_steps
    }

def get_google_route(api_key: str, lat1: float, lng1: float, lat2: float, lng2: float) -> Dict:
    url = f"https://maps.googleapis.com/maps/api/directions/json?origin={lat1},{lng1}&destination={lat2},{lng2}&key={api_key}&language=vi"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    data = response.json()
    
    if data.get("status") != "OK":
        raise ValueError(f"Google Maps API error: {data.get('status')}")
        
    route = data["routes"][0]
    leg = route["legs"][0]
    distance_km = leg["distance"]["value"] / 1000.0
    duration_minutes = leg["duration"]["value"] / 60.0
    
    raw_steps = []
    for step in leg.get("steps", []):
        instr = step.get("html_instructions", "")
        clean_instr = re.sub(r'<[^>]+>', '', instr)
        raw_steps.append(clean_instr)
        
    return {
        "distance_km": distance_km,
        "duration_minutes": duration_minutes,
        "raw_steps": raw_steps
    }

def calculate_route(lat1: float, lng1: float, lat2: float, lng2: float) -> Dict:
    api_key = settings.GOOGLE_MAPS_API_KEY
    if api_key:
        try:
            return get_google_route(api_key, lat1, lng1, lat2, lng2)
        except Exception as e:
            print(f"Google Maps API failed, falling back to OSRM: {e}")
            return get_osrm_route(lat1, lng1, lat2, lng2)
    else:
        return get_osrm_route(lat1, lng1, lat2, lng2)

def resolve_maps(url: str, origin_station_id: Optional[str] = None, custom_coords: Optional[Dict] = None) -> Dict:
    dest_lat, dest_lng = extract_coordinates_from_url(url)
    
    origin_lat, origin_lng = None, None
    station_name = "Đội PCCC"
    
    if custom_coords:
        origin_lat = custom_coords["lat"]
        origin_lng = custom_coords["lng"]
        station_name = custom_coords.get("name", station_name)
    elif origin_station_id:
        station = next((s for s in MOCK_FIRE_STATIONS if s["id"] == origin_station_id), None)
        if station:
            origin_lat = station["lat"]
            origin_lng = station["lng"]
            station_name = station["name"]
            
    if origin_lat is None or origin_lng is None:
        raise ValueError("Vui lòng cung cấp origin_station_id hợp lệ hoặc custom_origin_coords.")
        
    route_info = calculate_route(origin_lat, origin_lng, dest_lat, dest_lng)
    route_string = build_pc08_route_string(station_name, route_info["raw_steps"], route_info["distance_km"])
    
    return {
        "latitude": dest_lat,
        "longitude": dest_lng,
        "formatted_address": None,
        "distance_km": route_info["distance_km"],
        "duration_minutes": route_info["duration_minutes"],
        "route_description": route_string,
        "raw_steps": route_info["raw_steps"]
    }

def get_stations():
    return MOCK_FIRE_STATIONS
