import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, Loader2 } from 'lucide-react';

export default function LeftSidebar({ data, updateData }) {
  const [loadingCalc, setLoadingCalc] = useState(false);

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCalc = async () => {
    setLoadingCalc(true);
    try {
      const res = await axios.post('/api/v1/pccc_calc/calculate', {
        material_type: data.material_type || 'wood',
        time_free_burn_minutes: 15,
        fire_shape: "circle",
        nozzle_type: "nozzle_B"
      });
      updateData(res.data);
    } catch (e) {
      alert("Lỗi tính toán: " + e.message);
    }
    setLoadingCalc(false);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-slate-50">
        <h2 className="font-bold text-slate-800 text-lg uppercase">Variables</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Nhóm 1: Thông tin Hành chính */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Thông tin Hành chính</h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Tên cơ sở</label>
            <input name="ten_co_so" value={data.ten_co_so || ''} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Địa chỉ / Lộ trình</label>
            <textarea name="dia_chi_co_so" value={data.dia_chi_co_so || ''} onChange={handleChange} rows={2} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
        </div>

        {/* Nhóm 2: Kiến trúc & Xây dựng */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Kiến trúc</h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Loại hình kinh doanh</label>
            <input name="business_type" value={data.business_type || ''} onChange={handleChange} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"/>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Số tầng</label>
              <input type="number" name="so_tang" value={data.so_tang || 1} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none"/>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Diện tích (m2)</label>
              <input type="number" name="tong_dien_tich_xay_dung" value={data.tong_dien_tich_xay_dung || 0} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none"/>
            </div>
          </div>
        </div>

        {/* Nhóm 3: Chiến thuật & Thủy lực */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Chiến thuật</h3>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Chất cháy chủ yếu</label>
            <select name="material_type" value={data.material_type || 'wood'} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none">
              <option value="wood">Gỗ, Vải, Giấy</option>
              <option value="oil">Xăng, Dầu, Hóa chất</option>
              <option value="plastic">Nhựa, Nilon, Cao su</option>
              <option value="gas">Khí Gas, LPG</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Vị trí điểm cháy</label>
            <input name="b_diem_chay" value={data.b_diem_chay || ''} onChange={handleChange} className="w-full border p-2 rounded text-sm outline-none"/>
          </div>

          <button onClick={handleCalc} disabled={loadingCalc} className="w-full bg-slate-800 text-white font-medium py-2 rounded flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
            {loadingCalc ? <Loader2 className="animate-spin" size={16}/> : <Calculator size={16}/>} Tính Thủy Lực
          </button>
          
          {(data.fire_trucks_needed > 0) && (
            <div className="bg-green-50 text-green-800 p-3 rounded-lg text-xs grid grid-cols-2 gap-2 border border-green-200">
              <div>S.Cháy: <strong>{data.fire_area_m2} m2</strong></div>
              <div>Số xe: <strong>{data.fire_trucks_needed}</strong></div>
              <div>Lăng C/c: <strong>{data.nozzles_extinguish}</strong></div>
              <div>Lăng L/m: <strong>{data.nozzles_cooling}</strong></div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
