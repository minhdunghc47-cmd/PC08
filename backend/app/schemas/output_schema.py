from pydantic import BaseModel
from typing import Optional, List

# --- MAPS ---
class ResolveMapsResponse(BaseModel):
    latitude: float
    longitude: float
    formatted_address: Optional[str] = None
    distance_km: float
    duration_minutes: float
    route_description: str
    raw_steps: List[str]

class StationResponse(BaseModel):
    id: str
    name: str
    lat: float
    lng: float

# --- CALC ---
class PcccCalcResponse(BaseModel):
    radius_m: float
    fire_area_m2: float
    extinguish_area_m2: float
    required_water_l_s: float
    cooling_water_l_s: float
    nozzles_extinguish: int
    nozzles_cooling: int
    total_water_l_s: float
    fire_trucks_needed: int
    water_volume_m3_per_hour: float

# --- LLM AI ---
class MucBGiaDinh(BaseModel):
    thoi_gian_gia_dinh: str
    diem_xay_ra_chay: str
    nguyen_nhan_gia_dinh: str
    dien_bien_phat_trien: str
    so_nguoi_bi_nan: str

class MucBChienThuat(BaseModel):
    bien_phap_chua_chay: str
    phuong_phap_chua_chay: str
    an_toan_luc_luong: str
    thong_tin_chi_huy: str

class MucBLuuYDacBiet(BaseModel):
    chat_ky_nuoc: str
    khu_vuc_khoi_doc: str
    khu_vuc_kho_tiep_can: str
    nguy_co_no: str

class CacLucLuongHoTro(BaseModel):
    cong_an_dia_phuong: str
    csgt: str
    y_te: str
    dien_luc: str

class MucBPhanCongNhiemVu(BaseModel):
    nhiem_vu_tai_cho: str
    nhiem_vu_trinh_sat: str
    xe_c1_tac_chien: str
    xe_c2_tac_chien: str
    xe_c3_hoac_cnch: Optional[str] = None
    cac_luc_luong_ho_tro: CacLucLuongHoTro

class TinhHuongCNCH(BaseModel):
    ten_su_co: str
    gia_dinh: str
    bien_phap_xu_ly: str

class MucCTinhHuongPhu(BaseModel):
    tinh_huong_chay_1: str
    tinh_huong_chay_2: str
    tinh_huong_cnch: TinhHuongCNCH

class BangThongKeRow(BaseModel):
    stt: str
    don_vi: str
    dien_thoai: str
    so_nguoi: str
    phuong_tien: str
    ghi_chu: str

class GeneratedPC08Content(BaseModel):
    giao_thong_nguon_nuoc: str
    giai_thich_phep_toan: str
    muc_iv_nguy_hiem_chay_no: str
    muc_b_gia_dinh_tinh_huong: MucBGiaDinh
    muc_b_chien_thuat: MucBChienThuat
    muc_b_luu_y_dac_biet: MucBLuuYDacBiet
    muc_b_phan_cong_nhiem_vu: MucBPhanCongNhiemVu
    muc_c_tinh_huong_phu: MucCTinhHuongPhu
    bang_thong_ke_luc_luong: List[BangThongKeRow]

class SectionGenerationResponse(BaseModel):
    text: str
