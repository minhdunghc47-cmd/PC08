import math
from app.core.constants import FIRE_MATERIAL_SPECS, FIRE_EQUIPMENT_SPECS
from app.schemas.input_schema import PcccCalcRequest
from app.schemas.output_schema import PcccCalcResponse

def calculate_fire_parameters(request: PcccCalcRequest) -> PcccCalcResponse:
    material = FIRE_MATERIAL_SPECS.get(request.material_type)
    if not material:
        raise ValueError("Loại chất cháy không hợp lệ.")
        
    equipment = FIRE_EQUIPMENT_SPECS.get(request.nozzle_type)
    if not equipment:
        raise ValueError("Loại lăng không hợp lệ.")
        
    # Vận tốc lan truyền (m/s) -> (m/phút)
    v_l_m_s = material["linear_fire_spread_velocity"]
    v_l_m_min = v_l_m_s * 60
    
    t_td = request.time_free_burn_minutes
    
    # 1. Tính bán kính cháy R_ch (m)
    # Theo chuẩn PCCC: t <= 10 phút thì V = 0.5 * V_phut
    if t_td <= 10:
        r_ch = 0.5 * v_l_m_min * t_td
    else:
        r_ch = 0.5 * v_l_m_min * 10 + v_l_m_min * (t_td - 10)
        
    # 2. Tính diện tích cháy S_ch (m2)
    shape_factor = 1.0
    if request.fire_shape == "semicircle":
        shape_factor = 0.5
    elif request.fire_shape == "quarter":
        shape_factor = 0.25
        
    s_ch_unbounded = shape_factor * math.pi * (r_ch ** 2)
    
    if request.fire_shape == "rectangle" and request.room_length_m and request.room_width_m:
        s_ch = min(s_ch_unbounded, request.room_length_m * request.room_width_m)
    else:
        s_ch = s_ch_unbounded
        
    # 3. Tính diện tích chữa cháy S_cc (m2)
    h_cc = 5.0 # Chiều sâu chữa cháy của lăng (m)
    
    if request.fire_shape == "rectangle":
        s_cc = s_ch # Thường ở trong phòng sẽ phủ toàn bộ
    elif r_ch <= h_cc:
        s_cc = s_ch
    else:
        # Tính theo vòng ngoài
        s_cc_outer = shape_factor * math.pi * ((r_ch)**2 - (r_ch - h_cc)**2)
        s_cc = s_cc_outer
        
    # 4. Tính lưu lượng nước cần thiết
    i_y = material.get("required_water_intensity", 0.08)
    i_lm = material.get("cooling_water_intensity", 0.04)
    
    q_ct = s_cc * i_y
    q_lm = s_ch * i_lm
    
    # 5. Số lượng lăng
    q_lang = equipment["flow_rate"]
    n_lcc = math.ceil(q_ct / q_lang) if q_ct > 0 else 0
    n_llm = math.ceil(q_lm / q_lang) if q_lm > 0 else 0
    
    if n_lcc == 0 and s_ch > 0:
        n_lcc = 1 # Đảm bảo ít nhất 1 lăng nếu có cháy
        
    q_tong = (n_lcc * q_lang) + (n_llm * q_lang)
    
    # 6. Số lượng xe chữa cháy
    q_xe = FIRE_EQUIPMENT_SPECS["standard_fire_truck_flow"]
    n_xe = math.ceil(q_tong / q_xe)
    
    # Lượng nước cần cho 1 giờ (m3) = (lít/s * 3600) / 1000
    water_volume_m3 = (q_tong * 3600) / 1000.0
    
    return PcccCalcResponse(
        radius_m=round(r_ch, 2),
        fire_area_m2=round(s_ch, 2),
        extinguish_area_m2=round(s_cc, 2),
        required_water_l_s=round(q_ct, 2),
        cooling_water_l_s=round(q_lm, 2),
        nozzles_extinguish=n_lcc,
        nozzles_cooling=n_llm,
        total_water_l_s=round(q_tong, 2),
        fire_trucks_needed=n_xe,
        water_volume_m3_per_hour=round(water_volume_m3, 2)
    )
