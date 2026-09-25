import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, SlidersHorizontal, Menu, X } from 'lucide-react';
import LeftSidebar from './components/LeftSidebar';
import AiWorkspace from './components/AiWorkspace';
import DocumentPreview from './components/DocumentPreview';

const defaultData = {
  ten_co_so: 'Cơ sở Demo',
  dia_chi_co_so: 'Số 1, Phố Y, Hà Nội',
  google_maps_link: '',
  business_type: 'Nhà xưởng',
  so_tang: 2,
  tong_dien_tich_xay_dung: 1000,
  tru_luong_be_ngam: 200,
  material_type: 'wood',
  fire_area_m2: 0,
  required_water_l_s: 0,
  fire_trucks_needed: 0,
  nozzles_extinguish: 0,
  nozzles_cooling: 0,
  
  // AI Sections
  a_i_vi_tri: '',
  a_ii_giao_thong: '',
  a_iii_nguon_nuoc: '',
  a_iv_nguy_hiem: '',
  a_v_ll_tai_cho: '',
  a_vi_pt_tai_cho: '',
  b_1_gia_dinh: '',
  b_2_tinh_toan: '',
  b_3_chien_thuat: '',
  b_4_luc_luong: '',
  b_5_an_toan: '',
  b_6_nv_co_so: '',
  b_6_nv_pccc: '',
  b_6_nv_khac: '',
  c_tinh_huong_khac: ''
};

function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('pc08_draft_data');
      if (saved) return { ...defaultData, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Lỗi đọc localStorage:", e);
    }
    return defaultData;
  });

  const [activeTab, setActiveTab] = useState("variables");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auto-save data mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('pc08_draft_data', JSON.stringify(data));
  }, [data]);

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-100 overflow-hidden text-slate-800 font-sans">
      
      {/* TABLET HEADER (Hidden on Mobile & Desktop) */}
      <div className="hidden md:flex lg:hidden bg-slate-800 text-white p-2 items-center shadow-sm z-20">
        <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 transition">
          <Menu size={16} /> Mở cấu hình
        </button>
        <span className="ml-4 font-bold text-sm">PC08 Editor</span>
      </div>

      {/* DRAWER (Tablet only) */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 lg:hidden ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isDrawerOpen ? 'opacity-50' : 'opacity-0'}`} onClick={() => setIsDrawerOpen(false)} />
        <div className="absolute top-0 left-0 w-[85%] max-w-sm h-full bg-white shadow-2xl flex flex-col">
          <div className="p-3 flex justify-between items-center border-b bg-slate-50">
            <span className="font-bold text-slate-700">Thông tin Cơ sở</span>
            <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-slate-200 rounded"><X className="text-slate-500"/></button>
          </div>
          <div className="flex-1 overflow-hidden">
             <LeftSidebar data={data} updateData={updateData} />
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden">
        {/* VARIABLES (Mobile Tab OR Desktop) */}
        <div className={`h-full border-r border-slate-300 w-full lg:w-[25%] ${activeTab === 'variables' ? 'block' : 'hidden'} md:hidden lg:block`}>
          <LeftSidebar data={data} updateData={updateData} />
        </div>

        {/* AI WORKSPACE (Mobile Tab OR Tablet/Desktop) */}
        <div className={`h-full border-r border-slate-300 w-full md:w-[50%] lg:w-[33.33%] ${activeTab === 'ai' ? 'block' : 'hidden'} md:block`}>
          <AiWorkspace data={data} updateData={updateData} />
        </div>

        {/* PREVIEW (Mobile Tab OR Tablet/Desktop) */}
        <div className={`h-full w-full md:w-[50%] lg:w-[41.66%] ${activeTab === 'preview' ? 'block' : 'hidden'} md:block`}>
          <DocumentPreview data={data} />
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden flex bg-white border-t border-slate-200 text-[11px] font-medium pb-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
        <button onClick={() => setActiveTab('variables')} className={`flex-1 py-1 flex flex-col items-center gap-1 ${activeTab === 'variables' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <SlidersHorizontal size={22} /> Nhập liệu
        </button>
        <button onClick={() => setActiveTab('ai')} className={`flex-1 py-1 flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <Sparkles size={22} /> AI Co-pilot
        </button>
        <button onClick={() => setActiveTab('preview')} className={`flex-1 py-1 flex flex-col items-center gap-1 ${activeTab === 'preview' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
          <FileText size={22} /> Bản in
        </button>
      </div>

    </div>
  );
}

export default App;
