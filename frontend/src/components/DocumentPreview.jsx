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
    <div className="bg-gray-200 p-2 md:p-8 overflow-x-auto overflow-y-auto flex md:justify-center w-full h-full relative">
      {/* Header Button */}
      <div className="absolute top-4 right-4 md:right-6 z-10">
        <button 
          onClick={handleDownload} 
          disabled={downloading}
          className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
        >
          {downloading ? <Loader2 className="animate-spin" size={18}/> : <Download size={18}/>}
          Tải .docx
        </button>
      </div>

      {/* Pages Container */}
      <div className="flex flex-col gap-8 pb-10 origin-top scale-[0.45] sm:scale-[0.55] md:scale-[0.65] lg:scale-[0.65] xl:scale-[0.75] mt-12 md:mt-0" style={{ transformOrigin: 'top center' }}>
        
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
          {/* Header */}
          <div className="relative mb-12">
            {/* Top Right */}
            <div className="absolute top-[-20px] right-0">
              <p className="font-bold text-[14pt] m-0">Mẫu số PC08</p>
            </div>
            
            {/* Centered Agency */}
            <div className="flex flex-col items-center text-center mt-12 w-full">
              <p className="font-normal text-[14pt] uppercase m-0 leading-tight">CÔNG AN {data.ten_cong_an_tinh}</p>
              <p className="font-bold text-[13.5pt] uppercase m-0 leading-tight mt-1 whitespace-nowrap tracking-tight">PHÒNG CẢNH SÁT PHÒNG CHÁY, CHỮA CHÁY VÀ CỨU NẠN, CỨU HỘ</p>
              <hr className="border-t-[1.5px] border-black w-2/5 mt-4" />
            </div>

            {/* Document Number */}
            <div className="mt-8">
              <p className="text-[14pt] m-0">Số: {data.so_phuong_an}</p>
            </div>
          </div>

          {/* Tiêu đề phương án */}
          <div className="text-center mt-[100px] mb-[80px]">
            <p className="font-bold text-[14pt] uppercase m-0">PHƯƠNG ÁN CHỮA CHÁY, CỨU NẠN, CỨU HỘ</p>
          </div>

          {/* Phần Nội dung */}
          <div className="space-y-6 px-4 text-[14pt]">
            <p className="flex w-full leading-snug">
              <span className="shrink-0 mr-2">Tên cơ sở:</span>
              <span className="flex-1 font-bold pl-2">{data.ten_co_so}</span>
            </p>
            <p className="flex w-full leading-snug">
              <span className="shrink-0 mr-2">Địa chỉ:</span>
              <span className="flex-1 pl-2">{data.dia_chi_co_so}</span>
            </p>
            <p className="flex w-full leading-snug">
              <span className="shrink-0 mr-2">Điện thoại:</span>
              <span className="flex-1 pl-2">{data.dien_thoai_co_so}</span>
            </p>
            <div className="flex flex-col w-full leading-snug gap-2">
              <span>Đơn vị được phân công thực hiện nhiệm vụ chữa cháy, cứu nạn, cứu hộ:</span>
              <span className="text-center font-bold">{data.don_vi_pccc}</span>
            </div>
            <p className="flex w-full leading-snug">
              <span className="shrink-0 mr-2">Điện thoại:</span>
              <span className="flex-1 pl-2">{data.dien_thoai_pccc}</span>
            </p>
          </div>
          
          {/* Đẩy chữ Năm xuống cuối trang */}
          <div className="text-center font-bold absolute bottom-[75px] left-0 w-full text-[14pt]">
            Năm {data.nam_ban_hanh}
          </div>
        </div>

        {/* --- PAGE 2: SƠ ĐỒ TỔNG MẶT BẰNG --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{ width: '794px', minHeight: '1123px', padding: '75px 56px 75px 113px', fontFamily: '"Times New Roman", Times, serif', fontSize: '19px', lineHeight: '1.5', textAlign: 'justify' }}
        >
          <div className="text-center mt-12 mb-6">
            <h2 className="font-bold uppercase text-[15pt] m-0">SƠ ĐỒ TỔNG MẶT BẰNG</h2>
          </div>
          <div className="space-y-4">
            <p className="indent-8 m-0">
              Cần thể hiện rõ tên gọi của các hạng mục, nhà, đường giao thông, nguồn nước trong cơ sở và các nguồn nước chữa cháy tiếp giáp xung quanh. Sơ đồ vẽ trên khổ giấy A4 hoặc lớn hơn cho phù hợp.
            </p>
            <p className="indent-8 italic m-0">
              (Sơ đồ tổng mặt bằng: sơ đồ thể hiện đường, lối thoát nạn, vị trí trụ, bể, bến lấy nước chữa cháy, vị trí bố trí phương tiện, thiết bị chữa cháy, cứu nạn, cứu hộ theo từng khu vực, hạng mục công trình trong cơ sở. Sơ đồ vẽ trên khổ giấy A4 hoặc lớn hơn cho phù hợp).
            </p>
          </div>
        </div>

        {/* --- PAGE 3: SECTION A --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{ width: '794px', minHeight: '1123px', padding: '75px 56px 75px 113px', fontFamily: '"Times New Roman", Times, serif', fontSize: '19px', lineHeight: '1.5', textAlign: 'justify' }}
        >
          <div className="text-justify">
            <h2 className="font-bold uppercase mb-4">A. ĐẶC ĐIỂM CÓ LIÊN QUAN ĐẾN CÔNG TÁC CHỮA CHÁY, CỨU NẠN, CỨU HỘ</h2>
            <p className="font-bold uppercase mb-2">I. Vị trí cơ sở</p>
            <div className="whitespace-pre-wrap mb-4 ml-8">{data.a_i_vi_tri || 'Cơ sở nằm ở tọa độ: .......................................\n1. Phía Đông giáp: ........................................\n2. Phía Tây giáp: .........................................\n3. Phía Nam giáp: .........................................\n4. Phía Bắc giáp: .........................................'}</div>
            
            <p className="font-bold uppercase mb-2">II. Giao thông bên trong và bên ngoài</p>
            <div className="whitespace-pre-wrap mb-4 ml-8">{data.a_ii_giao_thong || '1. Giao thông bên trong\na) Cổng chính: chiều rộng ....m; chiều cao.....m;\nCổng phụ (nếu có): chiều rộng ....m; chiều cao.....m;\nb) Đường giao thông xung quanh...\n2. Giao thông bên ngoài...'}</div>
            
            <p className="font-bold">III. Nguồn nước phục vụ chữa cháy</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_iii_nguon_nuoc || '...'}</p>
            
            <p className="font-bold">IV. Tính chất, đặc điểm nguy hiểm cháy, nổ, độc</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_iv_nguy_hiem || '...'}</p>
            
            <p className="font-bold">V. Tổ chức lực lượng PCCC tại chỗ</p>
            <p className="whitespace-pre-wrap mb-4">{data.a_v_ll_tai_cho || '...'}</p>
            
            <p className="font-bold">VI. Hệ thống, phương tiện PCCC tại chỗ</p>
            <p className="whitespace-pre-wrap mb-6">{data.a_vi_pt_tai_cho || '...'}</p>
          </div>
        </div>

        {/* --- PAGE 4: SECTION B --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{ width: '794px', minHeight: '1123px', padding: '75px 56px 75px 113px', fontFamily: '"Times New Roman", Times, serif', fontSize: '19px', lineHeight: '1.5', textAlign: 'justify' }}
        >
          <div className="text-justify">
            <h2 className="font-bold uppercase mb-4">B. PHƯƠNG ÁN XỬ LÝ TÌNH HUỐNG PHỨC TẠP NHẤT</h2>
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
          </div>
        </div>

        {/* --- PAGE 5: SECTION C --- */}
        <div 
          className="bg-white shadow-2xl text-black mx-auto shrink-0 relative"
          style={{ width: '794px', minHeight: '1123px', padding: '75px 56px 75px 113px', fontFamily: '"Times New Roman", Times, serif', fontSize: '19px', lineHeight: '1.5', textAlign: 'justify' }}
        >
          <div className="text-justify">
            <h2 className="font-bold uppercase mb-4">C. CÁC TÌNH HUỐNG KHÁC (CHÁY & CNCH)</h2>
            <p className="whitespace-pre-wrap mb-4">{data.c_tinh_huong_khac || '...'}</p>
          </div>
        </div>
      </div>
      </div>
  );
}
