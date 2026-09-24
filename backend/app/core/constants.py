MOCK_FIRE_STATIONS = [
    {
        "id": "doi_tx_phutho",
        "name": "Đội Cảnh sát PCCC và CNCH khu vực TX Phú Thọ",
        "lat": 21.4172,
        "lng": 105.2155
    },
    {
        "id": "doi_tp_viettri",
        "name": "Đội Cảnh sát PCCC và CNCH - Công an TP Việt Trì",
        "lat": 21.3180,
        "lng": 105.4012
    },
    {
        "id": "doi_khuvuc_1",
        "name": "Đội Chữa cháy và CNCH Khu vực 1 - Phòng PC07",
        "lat": 21.0285,
        "lng": 105.8542
    }
]

FIRE_MATERIAL_SPECS = {
    "wood": {
        "name": "Gỗ và sản phẩm từ gỗ",
        "linear_fire_spread_velocity": 0.015,
        "required_water_intensity": 0.08,
        "cooling_water_intensity": 0.04,
    },
    "textile": {
        "name": "Bông, vải sợi, dệt may",
        "linear_fire_spread_velocity": 0.02,
        "required_water_intensity": 0.10,
        "cooling_water_intensity": 0.05,
    },
    "paper_carton": {
        "name": "Giấy, bìa carton, bao bì",
        "linear_fire_spread_velocity": 0.018,
        "required_water_intensity": 0.09,
        "cooling_water_intensity": 0.045,
    },
    "plastic": {
        "name": "Nhựa, cao su, mút xốp",
        "linear_fire_spread_velocity": 0.025,
        "required_water_intensity": 0.12,
        "cooling_water_intensity": 0.06,
    },
    "petroleum": {
        "name": "Xăng dầu, chất lỏng dễ cháy (dùng bọt)",
        "linear_fire_spread_velocity": 0.03,
        "required_water_intensity": 0.08, # Simplified for standard logic
        "cooling_water_intensity": 0.05,
    }
}

FIRE_EQUIPMENT_SPECS = {
    "nozzle_B": {"flow_rate": 3.5, "pressure_bar": 4.0},
    "nozzle_A": {"flow_rate": 7.0, "pressure_bar": 4.0},
    "foam_generator": {"flow_rate": 6.0, "solution_rate": 6},
    "standard_fire_truck_flow": 40.0,
    "standard_fire_truck_tank_m3": 4.0
}
