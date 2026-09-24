import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'giao_thong_nguon_nuoc', title: 'II. Giao thông & Nguồn nước' },
  { id: 'muc_iv_nguy_hiem_chay_no', title: 'IV. Nguy hiểm cháy nổ' },
  { id: 'b_dien_bien_phat_trien', title: 'B.1 Giả định tình huống' },
  { id: 'giai_thich_phep_toan', title: 'B.2 Giải thích phép toán' },
  { id: 'b_bien_phap_chua_chay', title: 'B.3 Chiến thuật chữa cháy' },
  { id: 'b_an_toan_luc_luong', title: 'B.3 An toàn lực lượng' },
  { id: 'b_nhiem_vu_trinh_sat', title: 'B.4 Nhiệm vụ Trinh sát' },
  { id: 'b_xe_c1', title: 'B.4 Nhiệm vụ Xe C1' },
  { id: 'b_xe_c2', title: 'B.4 Nhiệm vụ Xe C2' },
  { id: 'b_xe_tec', title: 'B.4 Nhiệm vụ Xe Téc' },
  { id: 'b_nhiem_vu_ca_xa', title: 'B.4 Công an xã & ANTT' },
  { id: 'b_nhiem_vu_y_te', title: 'B.4 Y tế & Cấp cứu' },
  { id: 'c_tinh_huong_1', title: 'C.1 Tình huống cháy 1' },
  { id: 'c_tinh_huong_2', title: 'C.1 Tình huống cháy 2' },
  { id: 'c_cnch_bien_phap', title: 'C.2 Tình huống CNCH' }
];

export default function Step3({ data, updateData }) {
  const [loadingCalc, setLoadingCalc] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  const handleCalc = async () => {
    setLoadingCalc(true);
    try {
      const res = await axios.post('/api/v1/pccc_calc/calculate', {
        material_type: data.material_type,
        time_free_burn_minutes: 15,
        fire_shape: "circle",
        nozzle_type: "nozzle_B"
      });
      updateData(res.data);
    } catch (e) { alert("Lỗi tính toán: " + e.message); }
    setLoadingCalc(false);
  };

  const handleGenerateSection = async () => {
    if (data.fire_area_m2 === 0) return alert("Vui lòng Tính toán thủy lực trước khi gọi AI!");
    setLoadingAI(true);
    try {
      const payload = {
        full_context: {
          facility: {
            name: data.ten_co_so,
            business_type: data.business_type,
            address: data.dia_chi_co_so,
            area_m2: Number(data.tong_dien_tich_xay_dung) || 1000,
            floors: data.floors || []
          },
          calc_params: {
            material_type: data.material_type,
            time_free_burn_minutes: 15,
            fire_shape: "circle",
            nozzle_type: "nozzle_B"
          },
          station_name: data.don_vi_pccc,
          route_description: data.route_description
        },
        section_key: SECTIONS.find(s => s.id === activeSection).title
      };
      const res = await axios.post('/api/v1/document/generate-section', payload);
      updateData({ [activeSection]: res.data.text });
    } catch (e) { 
      alert("Lỗi AI: " + e.message); 
    }
    setLoadingAI(false);
  };

  const handleChange = (e) => updateData({ [activeSection]: e.target.value });

  const activeTitle = SECTIONS.find(s => s.id === activeSection)?.title;

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Thủy Lực */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800">Thủy lực cơ sở</h2>
          <button onClick={handleCalc} disabled={loadingCalc} className="bg-slate-800 text-white px-3 py-1.5 rounded flex items-center gap-2 hover:bg-slate-700 text-sm font-medium transition-colors">
            {loadingCalc ? <Loader2 className="animate-spin" size={16}/> : <Calculator size={16}/>} 
            Tính thủy lực
          </button>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center"><div className="text-slate-500 font-medium">S.Cháy</div><div className="font-bold text-red-600">{data.fire_area_m2 || 0} m2</div></div>
          <div className="text-center"><div className="text-slate-500 font-medium">Số xe</div><div className="font-bold text-red-600">{data.fire_trucks_needed || 0}</div></div>
          <div className="text-center"><div className="text-slate-500 font-medium">Lăng C/c</div><div className="font-bold text-red-600">{data.nozzles_extinguish || 0}</div></div>
          <div className="text-center"><div className="text-slate-500 font-medium">Lăng L/m</div><div className="font-bold text-red-600">{data.nozzles_cooling || 0}</div></div>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-1 gap-4 overflow-hidden min-h-[500px]">
        {/* Left Pane: Tree Menu */}
        <div className="w-1/3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-sm">
            MỤC LỤC PHƯƠNG ÁN
          </div>
          <div className="overflow-y-auto p-2 space-y-1">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center justify-between ${
                  activeSection === sec.id 
                    ? 'bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600' 
                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <span>{sec.title}</span>
                {data[sec.id] && <CheckCircle2 size={14} className="text-green-500"/>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Pane: AI Co-pilot Workspace */}
        <div className="w-2/3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
          {/* AI Toolbar */}
          <div className="p-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-blue-600">✍️</span> {activeTitle}
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleGenerateSection} 
                disabled={loadingAI}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm"
              >
                {loadingAI ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} 
                Nhờ AI chắp bút
              </button>
            </div>
          </div>
          
          {/* Textarea */}
          <div className="flex-1 p-4 bg-slate-50">
            <textarea
              value={data[activeSection] || ''}
              onChange={handleChange}
              placeholder="Nhập nội dung cho mục này, hoặc bấm 'Nhờ AI chắp bút' ở trên..."
              className="w-full h-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-serif text-sm leading-relaxed text-slate-800 shadow-inner"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
