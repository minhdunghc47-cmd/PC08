import React from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function Step2({ data, updateData }) {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });
  
  const floors = data.floors || [];
  
  const addFloor = () => {
    updateData({ floors: [...floors, { name: '', function: '' }] });
  };
  
  const updateFloor = (index, field, value) => {
    const newFloors = [...floors];
    newFloors[index][field] = value;
    updateData({ floors: newFloors });
  };
  
  const removeFloor = (index) => {
    const newFloors = floors.filter((_, i) => i !== index);
    updateData({ floors: newFloors });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Quy mô & Lực lượng tại chỗ</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-700">Đặc điểm Kiến trúc</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Loại hình kinh doanh</label>
            <input name="business_type" value={data.business_type} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Chất cháy chủ yếu (Quyết định thủy lực)</label>
            <select name="material_type" value={data.material_type} onChange={handleChange} className="w-full border p-2 rounded bg-slate-50">
              <option value="wood">Gỗ và sản phẩm từ gỗ</option>
              <option value="textile">Bông, vải sợi, dệt may</option>
              <option value="paper_carton">Giấy, bìa carton</option>
              <option value="plastic">Nhựa, cao su</option>
              <option value="petroleum">Xăng dầu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tổng diện tích xây dựng (m2)</label>
            <input name="tong_dien_tich_xay_dung" value={data.tong_dien_tich_xay_dung} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cổng chính rộng (m)</label>
              <input name="cong_chinh_rong" value={data.cong_chinh_rong} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cổng chính cao (m)</label>
              <input name="cong_chinh_cao" value={data.cong_chinh_cao} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đường nội bộ rộng (m)</label>
              <input name="duong_noi_bo_rong" value={data.duong_noi_bo_rong} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tải trọng nền đường (tấn)</label>
              <input name="duong_noi_bo_tai_trong" value={data.duong_noi_bo_tai_trong} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-bold text-slate-700">Cấu trúc các tầng (Tùy chọn)</h3>
              <button onClick={addFloor} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-200">
                <PlusCircle size={14}/> Thêm tầng
              </button>
            </div>
            {floors.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Chưa có thông tin tầng. AI sẽ tự động sinh nội dung nếu để trống.</p>
            ) : (
              <div className="space-y-2">
                {floors.map((floor, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" placeholder="Tên tầng (VD: Tầng 1)" value={floor.name} onChange={(e) => updateFloor(i, 'name', e.target.value)} className="border p-2 rounded w-1/3 text-sm" />
                    <input type="text" placeholder="Công năng (VD: Để xe, Kho)" value={floor.function} onChange={(e) => updateFloor(i, 'function', e.target.value)} className="border p-2 rounded flex-1 text-sm" />
                    <button onClick={() => removeFloor(i)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-700">Lực lượng & Hệ thống Cơ sở</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Thể tích bể ngầm PCCC (m3)</label>
            <input name="tru_luong_be_ngam" value={data.tru_luong_be_ngam} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Người đứng đầu cơ sở</label>
            <input name="nguoi_dung_dau" value={data.nguoi_dung_dau} onChange={handleChange} className="w-full border p-2 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Đội trưởng PCCC cơ sở</label>
              <input name="doi_truong_pccc" value={data.doi_truong_pccc} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tổng đội viên PCCC</label>
              <input name="tong_doi_vien_pccc" value={data.tong_doi_vien_pccc} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Số người trực trong giờ</label>
              <input name="truc_trong_gio" value={data.truc_trong_gio} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số người trực ngoài giờ</label>
              <input name="truc_ngoai_gio" value={data.truc_ngoai_gio} onChange={handleChange} className="w-full border p-2 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
