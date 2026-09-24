import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Search, Loader2 } from 'lucide-react';

export default function Step1({ data, updateData }) {
  const [stations, setStations] = useState([]);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    axios.get('/api/v1/maps/stations').then(res => setStations(res.data)).catch(console.error);
  }, []);

  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  const resolveMaps = async () => {
    if (!data.maps_url || !data.origin_station_id) return alert("Vui lòng nhập Link Map và chọn Đội PCCC!");
    setLoadingMap(true);
    try {
      const res = await axios.post('/api/v1/maps/resolve', {
        maps_url: data.maps_url,
        origin_station_id: data.origin_station_id
      });
      updateData({
        toa_do: `${res.data.latitude}, ${res.data.longitude}`,
        distance_km: res.data.distance_km,
        duration_minutes: res.data.duration_minutes,
        route_description: res.data.route_description
      });
    } catch (error) {
      alert("Lỗi giải mã bản đồ: " + error.message);
    }
    setLoadingMap(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Thông tin Pháp lý & Vị trí</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cơ quan chủ quản</label>
            <input name="co_quan_chu_quan" value={data.co_quan_chu_quan} onChange={handleChange} className="w-full border p-2 rounded" placeholder="VD: CÔNG AN TỈNH PHÚ THỌ"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên cơ sở</label>
            <input name="ten_co_so" value={data.ten_co_so} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Địa chỉ cơ sở</label>
            <input name="dia_chi_co_so" value={data.dia_chi_co_so} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Đơn vị PCCC</label>
            <input name="don_vi_pccc" value={data.don_vi_pccc} onChange={handleChange} className="w-full border p-2 rounded" placeholder="VD: PHÒNG CẢNH SÁT PCCC VÀ CNCH"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
            <input name="dien_thoai_co_so" value={data.dien_thoai_co_so} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Năm xây dựng</label>
            <input name="nam_xay_dung" value={data.nam_xay_dung} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={20} className="text-red-600"/> Tích hợp Google Maps</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chọn Đội Cảnh sát PCCC phụ trách</label>
            <select name="origin_station_id" value={data.origin_station_id} onChange={handleChange} className="w-full border p-2 rounded bg-white">
              <option value="">-- Chọn Đội PCCC --</option>
              {stations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL Google Maps cơ sở</label>
            <div className="flex gap-2">
              <input name="maps_url" value={data.maps_url} onChange={handleChange} className="flex-1 border p-2 rounded" placeholder="Dán link Google Maps..."/>
              <button onClick={resolveMaps} disabled={loadingMap} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 min-w-[120px] justify-center">
                {loadingMap ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} Phân tích
              </button>
            </div>
          </div>
        </div>
        
        {data.route_description && (
          <div className="bg-white p-4 rounded border border-blue-100 shadow-sm text-sm">
            <p><strong>Tọa độ:</strong> {data.toa_do}</p>
            <p><strong>Khoảng cách:</strong> {data.distance_km} km | <strong>Thời gian:</strong> {data.duration_minutes.toFixed(1)} phút</p>
            <p className="mt-2 text-red-600"><strong>Lộ trình PC08:</strong> {data.route_description}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {['Đông', 'Tây', 'Nam', 'Bắc'].map((dir, i) => {
          const field = `giap_${['dong', 'tay', 'nam', 'bac'][i]}`;
          return (
            <div key={dir}>
              <label className="block text-sm font-medium mb-1">Giáp {dir}</label>
              <input name={field} value={data[field]} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
