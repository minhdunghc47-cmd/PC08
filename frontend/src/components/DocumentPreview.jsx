import React, { useState } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';

export default function DocumentPreview({ data }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    // Note: To map perfectly, you might want to update the docx script later.
    // For now, download triggers the backend export-docx.
    alert("Tính năng tải xuống file Word đang được cập nhật để khớp với cấu trúc mới!");
  };

  return (
    <div className="bg-gray-200 p-8 overflow-y-auto flex justify-center h-full relative">
      {/* Header Button */}
      <div className="absolute top-4 right-6 z-10">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          {downloading ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
          Tải xuống .docx
        </button>
      {/* Pages Container */}
      <div className="flex flex-col gap-8 pb-10" style={{ zoom: 0.65 }}>
        
        {/* --- PAGE 1: COVER PAGE --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '75px 56px 75px 113px',
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '19px',
            lineHeight: '1.5',
            textAlign: 'justify'
          }}
        >
          {/* Header: Cơ quan ban hành & Mẫu PC08 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex flex-col items-center text-center">
              <p className="font-normal text-[13pt] uppercase m-0 leading-tight">CÔNG AN TỈNH PHÚ THỌ</p>
              <p className="font-bold text-[13pt] uppercase m-0 leading-tight">PHÒNG CẢNH SÁT PCCC VÀ CNCH</p>
              <hr className="border-t-[1.5px] border-black w-1/3 mt-2 mb-2" />
              <p className="text-[13pt] m-0 leading-tight">Số: ........./PA-PC07</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <p className="font-bold text-[13pt] m-0 leading-tight">Mẫu PC08</p>
              <p className="font-normal text-[13pt] m-0 leading-tight">BH theo Nghị định số 105/2025/NĐ-CP</p>
              <p className="font-normal text-[13pt] m-0 leading-tight">Ngày 15/5/2025</p>
            </div>
          </div>

          {/* Tiêu đề phương án */}
          <div className="text-center mt-[100px] mb-[80px]">
            <p className="font-bold text-[22pt] uppercase m-0">PHƯƠNG ÁN CHỮA CHÁY,<br/>CỨU NẠN, CỨU HỘ</p>
          </div>

          {/* Phần Nội dung */}
          <div className="text-justify space-y-3 px-8">
            <p><span className="font-bold">Tên cơ sở:</span> {data.ten_co_so || "........................................................................"}</p>
            <p><span className="font-bold">Địa chỉ:</span> {data.dia_chi_co_so || "........................................................................"}</p>
            <p><span className="font-bold">Điện thoại:</span> 0363.365.188</p>
            <p><span className="font-bold">Đơn vị được phân công thực hiện nhiệm vụ chữa cháy, CNCH:</span></p>
            <p className="pl-4">Phòng Cảnh sát PCCC & CNCH, Công an tỉnh Phú Thọ.</p>
            <p><span className="font-bold">Điện thoại:</span> 114</p>
            
            {/* Đẩy chữ Năm 2026 xuống cuối trang bằng khoảng trống tĩnh */}
            <div className="text-center font-bold absolute bottom-[75px] left-0 w-full">Năm 2026</div>
          </div>
        </div>

        {/* --- PAGE 2: CONTENT --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{
            width: '794px',
            minHeight: '1123px',
            padding: '75px 56px 75px 113px',
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '19px',
            lineHeight: '1.5',
            textAlign: 'justify'
          }}
        >
          <div className="text-justify">
            {/* --- CẤU TRÚC PC08 --- */}
            <h2 className="font-bold uppercase mb-4">A. ĐẶC ĐIỂM CÓ LIÊN QUAN</h2>
            <p className="font-bold">I. Vị trí cơ sở</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_i_vi_tri || '...'}</p>
            
            <p className="font-bold">II. Giao thông bên trong và bên ngoài</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_ii_giao_thong || '...'}</p>
            
            <p className="font-bold">III. Nguồn nước phục vụ chữa cháy</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_iii_nguon_nuoc || '...'}</p>
            
            <p className="font-bold">IV. Tính chất, đặc điểm nguy hiểm cháy, nổ, độc</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_iv_nguy_hiem || '...'}</p>
            
            <p className="font-bold">V. Tổ chức lực lượng PCCC tại chỗ</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_v_ll_tai_cho || '...'}</p>
            
            <p className="font-bold">VI. Hệ thống, phương tiện PCCC tại chỗ</p>
            <p className="whitespace-pre-wrap mb-6">{data.a_vi_pt_tai_cho || '...'}</p>

            <h2 className="font-bold uppercase mt-8 mb-4">B. PHƯƠNG ÁN XỬ LÝ TÌNH HUỐNG PHỨC TẠP NHẤT</h2>
            <p className="font-bold">1. Giả định tình huống cháy</p>
            <p className="whitespace-pre-wrap mb-4">{data.b_1_gia_dinh || '...'}</p>
            
            <p className="font-bold">2. Tính toán diện tích cháy và chữa cháy</p>
            <p className="whitespace-pre-wrap mb-4">{data.b_2_tinh_toan || '...'}</p>
            
            <p className="font-bold">3. Chiến thuật, kỹ thuật chữa cháy, CNCH</p>
            <p className="whitespace-pre-wrap mb-4">{data.b_3_chien_thuat || '...'}</p>
            
            <p className="font-bold">4. Lực lượng, phương tiện chữa cháy, CNCH</p>
            <p className="whitespace-pre-wrap mb-4">{data.b_4_luc_luong || '...'}</p>
            
            <p className="font-bold">5. Lưu ý đảm bảo an toàn</p>
            <p className="whitespace-pre-wrap mb-4">{data.b_5_an_toan || '...'}</p>
            
            <p className="font-bold">6. Tổ chức triển khai</p>
            <ul className="list-disc pl-8 mb-6">
              <li className="mb-2"><strong>Nhiệm vụ cơ sở:</strong> <span className="whitespace-pre-wrap">{data.b_6_nv_co_so || '...'}</span></li>
              <li className="mb-2"><strong>Nhiệm vụ Cảnh sát PCCC:</strong> <span className="whitespace-pre-wrap">{data.b_6_nv_pccc || '...'}</span></li>
              <li className="mb-2"><strong>Nhiệm vụ các lực lượng khác:</strong> <span className="whitespace-pre-wrap">{data.b_6_nv_khac || '...'}</span></li>
            </ul>

            <h2 className="font-bold uppercase mt-8 mb-4">C. CÁC TÌNH HUỐNG KHÁC (CHÁY & CNCH)</h2>
            <p className="whitespace-pre-wrap mb-4">{data.c_tinh_huong_khac || '...'}</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
