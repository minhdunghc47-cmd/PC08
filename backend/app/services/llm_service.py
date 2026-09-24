import google.generativeai as genai
from google.generativeai.types import content_types
from app.core.config import settings
from app.schemas.output_schema import GeneratedPC08Content
from app.schemas.input_schema import FullGenerationRequest
from app.services import calc_service
import json
import os

if settings.LLM_API_KEY:
    os.environ["GOOGLE_API_KEY"] = settings.LLM_API_KEY
    genai.configure(api_key=settings.LLM_API_KEY)

import logging
logger = logging.getLogger(__name__)



def get_mock_pc08_content() -> GeneratedPC08Content:
    return GeneratedPC08Content(
        giao_thong_nguon_nuoc="Lộ trình di chuyển thuận lợi, tuy nhiên do ngõ hẹp 3m nên xe chữa cháy lớn không vào sát được, phải dừng cách cơ sở 30m để rải vòi. Điều động thêm Đội CC&CNCH khu vực lân cận chi viện xe téc nước để đảm bảo nguồn nước chữa cháy liên tục do trụ nước gần nhất cách cơ sở 5km.",
        giai_thich_phep_toan="Thời gian cháy tự do được tính bằng tổng: Thời gian báo cháy (5 phút) + Xuất xe (2 phút) + Đi đường (10 phút) + Triển khai (3 phút) = 20 phút. Vận tốc cháy lan 0.4 m/phút. Diện tích đám cháy bao trùm không gian là 80 m2 do bị giới hạn bởi vách ngăn tường xây gạch.",
        bang_thong_ke_luc_luong=[
            {"stt": "1", "don_vi": "Đội CC&CNCH chủ công", "dien_thoai": "114", "so_nguoi": "12", "phuong_tien": "02 xe chữa cháy", "ghi_chu": "Lực lượng nòng cốt"},
            {"stt": "2", "don_vi": "Đội CC&CNCH chi viện", "dien_thoai": "114", "so_nguoi": "6", "phuong_tien": "01 xe téc", "ghi_chu": "Truyền tiếp nước"},
            {"stt": "3", "don_vi": "Y tế xã/phường", "dien_thoai": "115", "so_nguoi": "3", "phuong_tien": "01 xe cấp cứu", "ghi_chu": "Sơ cấp cứu nạn nhân"}
        ],
        muc_iv_nguy_hiem_chay_no="Cơ sở có khối lượng lớn chất dễ cháy như vải, thùng carton, nilon. Khi xảy ra cháy, tốc độ lan truyền nhanh, sinh ra nhiều khói độc (CO, HCN) và nhiệt lượng tỏa ra lớn. Nguy cơ sụp đổ kết cấu mái tôn khung thép nếu thời gian cháy kéo dài trên 15 phút.",
        muc_b_gia_dinh_tinh_huong={
            "thoi_gian_gia_dinh": "Vào hồi 23 giờ 30 phút ngày 15/10/2026",
            "diem_xay_ra_chay": "Kho nguyên liệu thành phẩm tại tầng 1",
            "nguyen_nhan_gia_dinh": "Do sự cố chập điện tại tủ điện phân phối",
            "dien_bien_phat_trien": "Đám cháy phát triển nhanh theo các kiện hàng, khói đen đậm đặc bao trùm toàn bộ không gian kho và lan sang khu vực xưởng may.",
            "so_nguoi_bi_nan": "Có 03 công nhân làm ca đêm bị hoảng loạn, mắc kẹt tại khu vực đóng gói"
        },
        muc_b_chien_thuat={
            "bien_phap_chua_chay": "Triển khai đội hình 02 lăng B tấn công trực tiếp vào gốc lửa, kết hợp 01 lăng B làm mát chống cháy lan.",
            "phuong_phap_chua_chay": "Sử dụng nước chữa cháy theo phương pháp làm lạnh, hạ nhiệt độ vùng cháy.",
            "an_toan_luc_luong": "Cán bộ chiến sĩ tham gia chữa cháy phải sử dụng mặt nạ phòng độc cách ly, kiểm tra kết cấu khung thép trước khi tiến sâu.",
            "thong_tin_chi_huy": "Ban chỉ huy chữa cháy đặt tại khoảng sân phía trước cơ sở. Kênh thông tin bộ đàm số 1."
        },
        muc_b_luu_y_dac_biet={
            "chat_ky_nuoc": "Không có",
            "khu_vuc_khoi_doc": "Khu vực kho chứa màng bọc nilon sinh nhiều khí độc",
            "khu_vuc_kho_tiep_can": "Lối đi giữa các kệ hàng hẹp, nhiều vật cản",
            "nguy_co_no": "Không có"
        },
        muc_b_phan_cong_nhiem_vu={
            "nhiem_vu_tai_cho": "Gõ kẻng báo động, cắt điện toàn bộ cơ sở, sử dụng bình chữa cháy xách tay khống chế ban đầu, hướng dẫn thoát nạn và đón xe chữa cháy.",
            "nhiem_vu_trinh_sat": "Tổ trinh sát gồm 03 đồng chí, mang theo camera nhiệt, mặt nạ phòng độc tiến vào tìm kiếm nạn nhân mắc kẹt.",
            "xe_c1_tac_chien": "Đỗ tại vị trí sân chính, triển khai 02 đội hình lăng B tấn công trực tiếp vào gốc lửa qua cửa chính.",
            "xe_c2_tac_chien": "Đỗ tại cổng phụ, triển khai 01 lăng B làm mát mái tôn và ngăn cháy lan sang khu vực xưởng lân cận.",
            "xe_c3_hoac_cnch": None,
            "cac_luc_luong_ho_tro": {
                "cong_an_dia_phuong": "Phong tỏa hiện trường, đảm bảo an ninh trật tự khu vực xung quanh.",
                "csgt": "Phân luồng tại ngã tư gần nhất, đảm bảo xe chữa cháy ra vào thuận lợi.",
                "y_te": "Bố trí xe cứu thương tại cổng chính, sơ cấp cứu nạn nhân và chuyển viện nếu cần.",
                "dien_luc": "Ngắt điện trung thế khu vực đảm bảo an toàn chữa cháy."
            }
        },
        muc_c_tinh_huong_phu={
            "tinh_huong_chay_1": "Cháy tại khu vực nhà để xe máy của công nhân",
            "tinh_huong_chay_2": "Cháy tại phòng hành chính - kế toán tầng 2",
            "tinh_huong_cnch": {
                "ten_su_co": "Sự cố sập đổ kết cấu do giông lốc mái tôn",
                "gia_dinh": "Vào hồi 14h00 ngày 20/07/2026, có 2 người bị cấu kiện đè lấp",
                "bien_phap_xu_ly": "Sử dụng banh cắt thủy lực và túi nâng khí nén để giải cứu nạn nhân."
            }
        }
    )

def generate_pc08_content(request: FullGenerationRequest) -> GeneratedPC08Content:
    if not settings.LLM_API_KEY:
        print("No LLM_API_KEY found, returning mock data.")
        return get_mock_pc08_content()
        
    genai.configure(api_key=settings.LLM_API_KEY)
    
    # Calculate hydraulics to inject into prompt
    calc_res = calc_service.calculate_fire_parameters(request.calc_params)
    
    system_instruction = (
        "Bạn là một Chỉ huy trưởng Tham mưu Tác chiến PCCC & CNCH xuất sắc của Bộ Công an. Bạn không viết văn bản hành chính khô khan, bạn đang kể lại một \"Kịch bản Tác chiến Sinh tử\" trên sa bàn.\n"
        "Giọng văn của bạn: Mạch lạc, dứt khoát, liền mạch. Tự nhiên lồng ghép các hiện tượng lý hóa (hiệu ứng ống khói, bức xạ nhiệt, cháy nhiệt không kiểm soát) và thuật ngữ chỉ huy (mũi đột kích, truyền tiếp nước, hành lang xanh, mở đường máu) vào mạch văn. Tuyệt đối không dùng gạch đầu dòng liệt kê máy móc. Mỗi mục là một đoạn văn kể chuyện chiến thuật sống động, có chiều sâu.\n\n"
        "TRONG TƯ DUY TÁC CHIẾN CỦA BẠN, LUÔN CÓ SẴN CÁC PHẢN XẠ SAU:\n"
        "1. Nguồn nước là sống còn: Tự động điều động thêm Xe Téc chi viện để bơm truyền tiếp sức trong mọi kịch bản.\n"
        "2. Mũi nhọn xuyên phá: Mũi tấn công chính (Xe C1) mặc định luôn dùng đội hình 02 lăng B đánh trực diện.\n"
        "3. Địa hình hẹp: Nếu ngõ nhỏ xe không vào sát, tự động ra lệnh \"mở đường máu\" lao thẳng vào hoặc mượn đường nhà hàng xóm.\n"
        "4. Thời gian (tch): Cháy ban đêm thì phát hiện muộn (5 phút), ban ngày thì phát hiện nhanh (2 phút).\n"
        "5. Khung thép mái tôn: Phản xạ đầu tiên là phải có lăng làm mát cấu kiện chịu lực để chống sập đổ.\n"
        "6. Có Sprinkler: Không bao giờ đổ lỗi hệ thống hỏng, mà luôn giả định cháy bắt nguồn từ bãi tập kết, kho tạm, mái hiên chưa được bảo vệ rồi mới cháy lan vào trong."
    )
    
    prompt = f"""
    Bạn phải soạn thảo các mục cho Phương án PC08. Dưới đây là DỮ LIỆU ĐẦU VÀO của cơ sở hiện tại:
    - Cơ sở: {request.facility.name}, kinh doanh: {request.facility.business_type}, diện tích: {request.facility.area_m2} m2.
    - Cấu trúc các tầng (nếu có): {', '.join([f"{f.name} ({f.function})" for f in request.facility.floors])}
    - Chất cháy chủ yếu: {request.calc_params.material_type}.
    - Thông số tính toán thủy lực:
      + Thời gian báo cháy (Tbc): 5 phút
      + Thời gian xuất xe (Txx): 2 phút
      + Thời gian đi đường (Ttđ): {int(calc_res.radius_m / 100)} phút (ước tính từ lộ trình)
      + Thời gian triển khai (Ttk): 3 phút
      + Vận tốc cháy lan (Vlt): 0.4 m/phút
      + Diện tích cháy thực tế (sau khi bị chặn bởi tường): {calc_res.fire_area_m2} m2.
      + Số xe chữa cháy cần thiết: {calc_res.fire_trucks_needed} xe.
      + Số lăng tấn công: {calc_res.nozzles_extinguish} lăng.
      + Số lăng làm mát: {calc_res.nozzles_cooling} lăng.
    - Lộ trình: {request.route_description} (Hãy dựa vào đây để phân tích giao thông).

    YÊU CẦU QUAN TRỌNG NHẤT: Bắt chước cách hành văn, độ dài và các thuật ngữ chuyên môn trong văn mẫu. TẠO JSON OUTPUT BÁM SÁT CHI TIẾT SAU:

    1. Yêu cầu sinh `giao_thong_nguon_nuoc` (Đoạn văn phân tích giao thông):
    - Dựa vào {request.route_description}, hãy tự bịa thêm 1 Đội PCCC chi viện hợp lý. Phân tích chi tiết quãng đường di chuyển của Đội chủ công và Đội chi viện, đánh giá mật độ kẹt xe, đường ngõ hẹp và lưu ý cho xe téc.

    2. Yêu cầu sinh `giai_thich_phep_toan`:
    - Viết đoạn văn trình bày công thức tính thời gian cháy tự do: Ttd = Tbc + Txx + Ttđ + Ttk = ... phút. Và giải thích diện tích đám cháy bị khống chế ở {calc_res.fire_area_m2} m2 do tường ngăn cháy.

    3. Yêu cầu sinh `muc_iv_nguy_hiem_chay_no`:
    - Dựa vào thông tin cấu trúc các tầng, phân tích hướng cháy lan, rủi ro ngạt khói theo hiệu ứng ống khói. 
    - VĂN MẪU THAM KHẢO VỀ ĐỘ CHI TIẾT: 'Tại cơ sở, chất cháy tồn tại với khối lượng lớn. Khi cháy, nhiệt độ bên trong có thể đạt tới hàng trăm độ C, tỏa ra nhiệt lượng cực lớn và khói độc đậm đặc. Nguy hiểm lớn nhất không phải là lửa đỏ, mà là khói và khí độc (HCN, CO). Do hiệu ứng ống khói (Chimney effect), áp suất nhiệt sẽ đẩy lượng khói độc này cuộn thốc lên các tầng trên với vận tốc rất nhanh, cô lập hoàn toàn lối thoát nạn. Tâm lý đám đông sẽ chuyển sang trạng thái hoảng loạn tột độ, chen lấn xô đẩy gây giẫm đạp...' 

    4. Yêu cầu sinh `muc_b_gia_dinh_tinh_huong`:
    - Áp dụng quy luật: Nếu có Sprinkler thì giả định cháy ở khu vực không được bảo vệ. 
    - VĂN MẪU THAM KHẢO: 'Khối lượng chất cháy tạo ra nhiệt lượng khổng lồ cùng lượng khói đen độc hại cực kỳ đậm đặc. Do xảy ra vào ban đêm/ngoài giờ không có người trực tiếp phát hiện, đám cháy phát triển tự do. Khách hàng hoảng loạn tột độ vì buồng thang bộ đã bị bịt kín bởi khói và bức xạ nhiệt. Không ai có thể tự thoát nạn, chen lấn kêu cứu ngoài ban công chờ lực lượng chuyên nghiệp ứng cứu...'

    5. Yêu cầu sinh `muc_b_chien_thuat` (Biện pháp và An toàn):
    - Áp dụng quy luật: Ngõ hẹp thì mở đường máu/mượn đường; Luôn dùng đội hình 2 lăng B.
    - VĂN MẪU THAM KHẢO: 'Áp dụng linh hoạt chiến thuật 2 gọng kìm phối hợp tác chiến: Gọng kìm 1 (Cứu nạn là ưu tiên tuyệt đối): Tuyệt đối không sử dụng cầu thang bộ đang ngập khói, triển khai ngay đội hình Xe Thang (hoặc mở đường máu) để giải cứu nạn nhân. Gọng kìm 2 (Trinh sát và dập lửa): Triển khai Tổ trinh sát mang mặt nạ cách ly (SCBA)... Mũi tấn công chính sử dụng lăng B phun tia nước đặc áp lực cao đánh trực diện vào gốc lửa, hấp thụ nhiệt lượng khổng lồ. Yêu cầu 100% cán bộ chiến sĩ tham gia mũi nhọn đột kích phải được trang bị mặt nạ phòng độc cách ly, quần áo chịu nhiệt và phải luân phiên thay ca chiến đấu để tránh kiệt sức và sốc nhiệt...'

    6. Yêu cầu sinh `muc_b_phan_cong_nhiem_vu`:
    - Phân bổ chính xác tổng số lăng và số xe vào các nhiệm vụ. Luôn có lệnh cho Xe Téc.

    7. Yêu cầu sinh `muc_c_tinh_huong_phu`:
    - Viết thành ĐOẠN VĂN MÔ TẢ KỊCH BẢN TÓM TẮT cho 2 tình huống cháy khác. 
    - Tình huống CNCH: Sự cố sập đổ/thang máy kẹt, nêu số nạn nhân và chiến thuật dùng thiết bị chuyên dụng.

    8. Yêu cầu sinh `bang_thong_ke_luc_luong` (Mảng JSON):
    - Tự động thống kê số lượng CBCS và phương tiện của: Đội PCCC chủ công, Đội chi viện, Công an xã, Y tế, Điện lực.
    """
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash", 
            system_instruction=system_instruction
        )
        
        response = model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=GeneratedPC08Content
            )
        )
        
        result_json = json.loads(response.text)
        return GeneratedPC08Content(**result_json)
        
    except Exception as e:
        print(f"Error calling LLM: {e}, returning mock data.")
        return get_mock_pc08_content()

def generate_specific_section(request: 'SectionGenerationRequest') -> str:
    try:
        calc_res = calc_service.calculate_fire_parameters(request.full_context.calc_params)
    except Exception:
        calc_res = None
    
    system_instruction = (
        "Bạn là một Chỉ huy trưởng Tham mưu Tác chiến PCCC & CNCH xuất sắc của Bộ Công an. Bạn không viết văn bản hành chính khô khan, bạn đang kể lại một \"Kịch bản Tác chiến Sinh tử\" trên sa bàn.\n"
        "Giọng văn của bạn: Mạch lạc, dứt khoát, liền mạch. Tự nhiên lồng ghép các hiện tượng lý hóa (hiệu ứng ống khói, bức xạ nhiệt, cháy nhiệt không kiểm soát) và thuật ngữ chỉ huy (mũi đột kích, truyền tiếp nước, hành lang xanh, mở đường máu) vào mạch văn. Tuyệt đối không dùng gạch đầu dòng liệt kê máy móc. Mỗi mục là một đoạn văn kể chuyện chiến thuật sống động, có chiều sâu.\n\n"
        "TRONG TƯ DUY TÁC CHIẾN CỦA BẠN, LUÔN CÓ SẴN CÁC PHẢN XẠ SAU:\n"
        "1. Nguồn nước là sống còn: Tự động điều động thêm Xe Téc chi viện để bơm truyền tiếp sức trong mọi kịch bản.\n"
        "2. Mũi nhọn xuyên phá: Mũi tấn công chính (Xe C1) mặc định luôn dùng đội hình 02 lăng B đánh trực diện.\n"
        "3. Địa hình hẹp: Nếu ngõ nhỏ xe không vào sát, tự động ra lệnh \"mở đường máu\" lao thẳng vào hoặc mượn đường nhà hàng xóm.\n"
        "4. Thời gian (tch): Cháy ban đêm thì phát hiện muộn (5 phút), ban ngày thì phát hiện nhanh (2 phút).\n"
        "5. Khung thép mái tôn: Phản xạ đầu tiên là phải có lăng làm mát cấu kiện chịu lực để chống sập đổ.\n"
        "6. Có Sprinkler: Không bao giờ đổ lỗi hệ thống hỏng, mà luôn giả định cháy bắt nguồn từ bãi tập kết, kho tạm, mái hiên chưa được bảo vệ rồi mới cháy lan vào trong."
    )
    
    fac = getattr(request.full_context, "facility", None)
    floors_str = ', '.join([f"{f.name} ({f.function})" for f in getattr(fac, "floors", [])]) if fac else ""
    
    prompt = f"""
    DỮ LIỆU ĐẦU VÀO TỔNG QUAN VỀ CƠ SỞ:
    - Tên Cơ sở: {getattr(fac, "name", "")} (Loại hình: {getattr(fac, "business_type", "")})
    - Tổng diện tích: {getattr(fac, "area_m2", 0)} m2.
    - Cấu trúc các tầng (nếu có): {floors_str}
    - Chất cháy chủ yếu: {getattr(request.full_context.calc_params, "material_type", "wood")}.
    - Thông số tính toán thủy lực:
      + Diện tích đám cháy: {getattr(calc_res, "fire_area_m2", 0)} m2.
      + Số xe chữa cháy cần: {getattr(calc_res, "fire_trucks_needed", 0)} xe.
      + Số lăng tấn công: {getattr(calc_res, "nozzles_extinguish", 0)} lăng.
      + Số lăng làm mát: {getattr(calc_res, "nozzles_cooling", 0)} lăng.
    - Giao thông xung quanh: {getattr(request.full_context, "route_description", "")}.

    NHIỆM VỤ HIỆN TẠI CỦA BẠN: 
    - Hãy đóng vai Chỉ huy trưởng, suy nghĩ và TẬP TRUNG CHUYÊN SÂU DUY NHẤT vào mục: "{getattr(request, "section_key", "")}".
    - Tuyệt đối không sinh lan man sang các mục khác. Chỉ viết nội dung phục vụ cho đúng đầu mục này.
    - Không bọc trong Markdown ```. Viết thành các đoạn văn dài, có chiều sâu, mang đậm chất chiến thuật.
    """
    
    import logging
    logger = logging.getLogger(__name__)

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash", 
            system_instruction=system_instruction
        )
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
        
        response = model.generate_content(prompt, safety_settings=safety_settings)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Lỗi gọi Gemini 2.0 Flash: {str(e)}")
        try:
            model_fallback = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction
            )
            response = model_fallback.generate_content(prompt, safety_settings=safety_settings)
            return response.text.strip()
        except Exception as e2:
            logger.error(f"Lỗi AI nghiêm trọng: {str(e2)}")
            raise ValueError(f"Lỗi AI nghiêm trọng: {str(e2)}. Vui lòng kiểm tra lại API Key hoặc mạng.")

def refine_specific_section(request: 'RefineSectionRequest') -> str:
    import logging
    logger = logging.getLogger(__name__)

    system_instruction = "Bạn là trợ lý AI biên tập văn bản tác chiến PCCC. Hãy giữ nguyên văn phong Chỉ huy trưởng, nhưng điều chỉnh đoạn văn theo đúng yêu cầu của người dùng. CHỈ TRẢ VỀ nội dung đã sửa (không giải thích, không bọc trong markdown code block)."
    prompt = f"VĂN BẢN HIỆN TẠI:\n{getattr(request, 'current_text', '')}\n\nYÊU CẦU SỬA ĐỔI:\n{getattr(request, 'instruction', '')}\n\nVĂN BẢN MỚI:"
    
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash", 
            system_instruction=system_instruction
        )
        
        safety_settings = [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_NONE"
            }
        ]
        
        response = model.generate_content(prompt, safety_settings=safety_settings)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Lỗi refine với Gemini 2.0 Flash: {str(e)}")
        try:
            model_fallback = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_instruction
            )
            response = model_fallback.generate_content(prompt, safety_settings=safety_settings)
            return response.text.strip()
        except Exception as e2:
            logger.error(f"Lỗi AI nghiêm trọng (Refine): {str(e2)}")
            raise ValueError(f"Lỗi AI nghiêm trọng: {str(e2)}")
