import React, { useState } from 'react';
import LeftSidebar from './components/LeftSidebar';
import AiWorkspace from './components/AiWorkspace';
import DocumentPreview from './components/DocumentPreview';

function App() {
  const [data, setData] = useState({
    ten_co_so: 'Cơ sở Demo',
    dia_chi_co_so: 'Số 1, Phố Y, Hà Nội',
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
  });

  const updateData = (newData) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 overflow-hidden text-slate-800 font-sans">
      <div className="w-1/4 h-full">
        <LeftSidebar data={data} updateData={updateData} />
      </div>
      <div className="w-[35%] h-full">
        <AiWorkspace data={data} updateData={updateData} />
      </div>
      <div className="w-[40%] h-full shadow-[0_0_20px_rgba(0,0,0,0.1)] z-10 border-l border-slate-300">
        <DocumentPreview data={data} />
      </div>
    </div>
  );
}

export default App;
