import React, { useState } from 'react';
import axios from 'axios';
import { Download, Loader2 } from 'lucide-react';

export default function Step4({ data }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const payload = {
        ...data,
        danh_sach_nguon_nuoc: [
          { stt: "1", loai_nguon: "Bể nước ngầm", tru_luong: `${data.tru_luong_be_ngam} m3`, vi_tri: "Dưới trạm bơm", ghi_chu: "Tốt" }
        ],
        hang_muc_cong_trinh: data.floors && data.floors.length > 0 
          ? data.floors.map(f => ({ ten: f.name, dien_tich: "-", cong_nang: f.function }))
          : [{ ten: data.business_type, dien_tich: data.tong_dien_tich_xay_dung, cong_nang: "Sản xuất/Kinh doanh" }],
        phuong_tien_tai_cho: [
          { ten: "Bình chữa cháy xách tay", so_luong: "30 bình" },
          { ten: "Chăn chiên chữa cháy", so_luong: "15 chiếc" }
        ],
        he_thong_pccc: [
          { ten: "Hệ thống báo cháy tự động", so_luong: "01 hệ thống" },
          { ten: "Hệ thống chữa cháy vách tường", so_luong: "01 hệ thống" }
        ]
      };

      const res = await axios.post('/api/v1/document/export-docx', payload, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `Phuong_an_PC08_${(data.ten_co_so || 'Kien_truc').replace(/\s+/g, '_')}.docx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (e) {
      alert("Lỗi xuất file: " + e.message);
    }
    setDownloading(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full p-4">
      {/* Cột trái: Preview */}
      <div className="flex-1 bg-white border border-slate-300 rounded-lg shadow-inner p-8 overflow-y-auto max-h-[80vh] font-serif text-sm text-slate-800 leading-relaxed">
        <h1 className="text-center font-bold text-lg mb-6">PHƯƠNG ÁN CHỮA CHÁY, CỨU NẠN, CỨU HỘ</h1>
        <div className="space-y-4">
          <p><strong>Tên cơ sở:</strong> {data.ten_co_so || '[Trống]'}</p>
          <p><strong>Địa chỉ:</strong> {data.dia_chi_co_so || '[Trống]'}</p>
          
          <h2 className="font-bold text-base mt-6 uppercase">A. Đặc điểm có liên quan</h2>
          <p><strong>Giao thông & Nguồn nước:</strong><br/>{data.giao_thong_nguon_nuoc || '[AI chưa sinh đoạn này]'}</p>
          
          <h2 className="font-bold text-base mt-6 uppercase">IV. Đặc điểm nguy hiểm cháy nổ</h2>
          <p className="whitespace-pre-wrap">{data.muc_iv_nguy_hiem_chay_no || '[AI chưa sinh đoạn này]'}</p>

          <h2 className="font-bold text-base mt-6 uppercase">B. Phương án xử lý tình huống phức tạp nhất</h2>
          <p><strong>1. Giả định tình huống:</strong><br/>{data.b_dien_bien_phat_trien || '[AI chưa sinh kịch bản]'}</p>
          <p><strong>2. Tính toán kỹ thuật:</strong><br/><span className="whitespace-pre-wrap">{data.giai_thich_phep_toan || '[Toán học chưa sinh]'}</span></p>
          <p><strong>3. Chiến thuật:</strong><br/><span className="whitespace-pre-wrap">{data.b_bien_phap_chua_chay || '[Chiến thuật chưa sinh]'}</span></p>
          
          <p><strong>4. Phân công nhiệm vụ:</strong></p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Trinh sát:</strong> {data.b_nhiem_vu_trinh_sat}</li>
            <li><strong>Xe C1:</strong> {data.b_xe_c1}</li>
            <li><strong>Xe C2:</strong> {data.b_xe_c2}</li>
          </ul>

          <p><strong>5. Bảng thống kê lực lượng:</strong></p>
          {data.bang_thong_ke_luc_luong ? (
            <table className="w-full border-collapse border border-slate-400 mt-2 text-xs">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-400 p-1">Đơn vị</th>
                  <th className="border border-slate-400 p-1">Số người</th>
                  <th className="border border-slate-400 p-1">Phương tiện</th>
                </tr>
              </thead>
              <tbody>
                {data.bang_thong_ke_luc_luong.map((row, idx) => (
                  <tr key={idx}>
                    <td className="border border-slate-400 p-1">{row.don_vi}</td>
                    <td className="border border-slate-400 p-1 text-center">{row.so_nguoi}</td>
                    <td className="border border-slate-400 p-1">{row.phuong_tien}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="italic text-slate-400">[Chưa có bảng thống kê]</p>}
        </div>
      </div>

      {/* Cột phải: Báo cáo & Download */}
      <div className="w-full md:w-80 flex flex-col items-center space-y-6">
        <div className="text-center space-y-2 mt-4">
          <h2 className="text-2xl font-bold text-slate-800">Hoàn tất!</h2>
          <p className="text-slate-500 text-sm">Xem trước văn bản ở cột bên trái.</p>
        </div>

        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 w-full text-sm">
          <ul className="space-y-2">
            <li className="flex items-center gap-2">✅ Thông tin: <strong>{data.ten_co_so ? 'OK' : 'Trống'}</strong></li>
            <li className="flex items-center gap-2">✅ Lộ trình: <strong>{data.distance_km ? data.distance_km + ' km' : '0 km'}</strong></li>
            <li className="flex items-center gap-2">✅ Thủy lực: <strong>{data.fire_trucks_needed || 0} xe</strong></li>
            <li className="flex items-center gap-2">✅ AI Generate: <strong>{data.b_bien_phap_chua_chay ? 'Hoàn thành' : 'Chưa chạy'}</strong></li>
          </ul>
        </div>

        <button 
          onClick={handleDownload} disabled={downloading}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          {downloading ? <Loader2 className="animate-spin" size={20}/> : <Download size={20}/>}
          Tải xuống File Word (.docx)
        </button>
      </div>
    </div>
  );
}
