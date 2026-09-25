import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Loader2, MessageSquare, Save, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'a_i_vi_tri', title: 'A.I Vị trí cơ sở' },
  { id: 'a_ii_giao_thong', title: 'A.II Giao thông' },
  { id: 'a_iii_nguon_nuoc', title: 'A.III Nguồn nước' },
  { id: 'a_iv_nguy_hiem', title: 'A.IV Đặc điểm nguy hiểm' },
  { id: 'a_v_ll_tai_cho', title: 'A.V Lực lượng tại chỗ' },
  { id: 'a_vi_pt_tai_cho', title: 'A.VI Phương tiện tại chỗ' },
  { id: 'b_1_gia_dinh', title: 'B.1 Giả định tình huống' },
  { id: 'b_2_tinh_toan', title: 'B.2 Tính toán kỹ thuật' },
  { id: 'b_3_chien_thuat', title: 'B.3 Chiến thuật, kỹ thuật' },
  { id: 'b_4_luc_luong', title: 'B.4 Lực lượng, phương tiện' },
  { id: 'b_5_an_toan', title: 'B.5 Lưu ý an toàn' },
  { id: 'b_6_nv_co_so', title: 'B.6 Nhiệm vụ Cơ sở' },
  { id: 'b_6_nv_pccc', title: 'B.6 Nhiệm vụ Cảnh sát PCCC' },
  { id: 'b_6_nv_khac', title: 'B.6 Nhiệm vụ Lực lượng khác' },
  { id: 'c_tinh_huong_khac', title: 'C. Các tình huống khác' }
];

export default function AiWorkspace({ data, updateData }) {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [instruction, setInstruction] = useState('');

  const currentText = data[activeSection] || '';

  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const generateContentForSection = async (secId) => {
    const sectionTitle = SECTIONS.find(s => s.id === secId).title;
    const prompt_text = `Bạn là một Chỉ huy trưởng Tham mưu Tác chiến PCCC & CNCH xuất sắc của Bộ Công an. Bạn không viết văn bản hành chính khô khan, bạn đang kể lại một "Kịch bản Tác chiến Sinh tử" trên sa bàn.
Giọng văn của bạn: Mạch lạc, dứt khoát, liền mạch. Tự nhiên lồng ghép các hiện tượng lý hóa và thuật ngữ chỉ huy. Tuyệt đối không dùng gạch đầu dòng liệt kê máy móc.
Nếu người dùng cung cấp link Google Maps hoặc tọa độ, hãy giả định khoảng cách từ Đội Cảnh sát PCCC gần nhất đến cơ sở để viết chi tiết mục Lộ trình tiếp cận. Đánh giá tính chất giao thông (đường lớn hay ngõ hẻm) dựa trên địa chỉ và lộ trình này.

NHIỆM VỤ HIỆN TẠI CỦA BẠN: 
Hãy đóng vai Chỉ huy trưởng, suy nghĩ và TẬP TRUNG CHUYÊN SÂU DUY NHẤT vào mục: "${sectionTitle}".
Cơ sở: ${data.ten_co_so || 'Chưa rõ'}
Địa chỉ: ${data.dia_chi_co_so || 'Chưa rõ'}
Vị trí bản đồ: ${data.google_maps_link || 'Không có'}
Tuyệt đối không sinh lan man sang các mục khác. Chỉ viết nội dung phục vụ cho đúng đầu mục này. Không bọc trong Markdown \`\`\`.`;

    const res = await axios.post('/api/llm', { prompt_text });
    updateData({ [secId]: res.data.text });
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await generateContentForSection(activeSection);
    } catch (e) { 
      const errMsg = e.response?.data?.text || e.message;
      alert("Lỗi AI: " + errMsg); 
    }
    setLoading(false);
  };

  const handleAutoGenerateAll = async () => {
    setIsAutoRunning(true);
    for (const section of SECTIONS) {
      if (data[section.id]) continue; // Skip if already filled
      
      setActiveSection(section.id);
      setLoading(true);
      
      try {
        await generateContentForSection(section.id);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Delay to avoid Rate Limit
      } catch (error) {
        console.error(`Lỗi ở mục ${section.id}`, error);
        alert(`Auto-pilot dừng ở mục ${section.title} do lỗi mạng/quá tải.`);
        break;
      }
    }
    setLoading(false);
    setIsAutoRunning(false);
  };

  const handleRefine = async () => {
    if (!currentText || !instruction.trim()) return;
    setLoading(true);
    try {
      const prompt_text = `Bạn là trợ lý AI biên tập văn bản tác chiến PCCC. Hãy giữ nguyên văn phong Chỉ huy trưởng, nhưng điều chỉnh đoạn văn theo đúng yêu cầu của người dùng. CHỈ TRẢ VỀ nội dung đã sửa (không giải thích, không bọc trong markdown code block).

VĂN BẢN HIỆN TẠI:
${currentText}

YÊU CẦU SỬA ĐỔI:
${instruction}

VĂN BẢN MỚI:`;

      const res = await axios.post('/api/llm', { prompt_text });
      updateData({ [activeSection]: res.data.text });
      setInstruction('');
    } catch (e) { 
      const errMsg = e.response?.data?.text || e.message;
      alert("Lỗi Refine AI: " + errMsg); 
    }
    setLoading(false);
  };

  const handleChangeText = (e) => updateData({ [activeSection]: e.target.value });

  return (
    <div className="h-full flex flex-col bg-slate-50 border-r border-slate-200 shadow-sm relative">
      {/* Header & Section Selector */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col gap-3">
        <h2 className="font-bold text-slate-800 text-lg uppercase flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20}/>
          AI Co-pilot Workspace
        </h2>
        
        <select 
          value={activeSection} 
          onChange={(e) => setActiveSection(e.target.value)}
          className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500"
        >
          {SECTIONS.map(s => (
             <option key={s.id} value={s.id}>
               {data[s.id] ? '✅ ' : ''}{s.title}
             </option>
          ))}
        </select>

        <button onClick={handleGenerate} disabled={loading || isAutoRunning} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm">
          {loading && !isAutoRunning ? <Loader2 className="animate-spin" size={16}/> : <Sparkles size={16}/>} 
          Viết Nháp Mới
        </button>

        <button 
          onClick={handleAutoGenerateAll} 
          disabled={isAutoRunning} 
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm mt-1 border-b-4 border-emerald-700 active:border-b-0 active:mt-2"
        >
          {isAutoRunning ? <Loader2 className="animate-spin" size={18}/> : "🚀"} 
          {isAutoRunning ? "Đang chạy Auto-Pilot..." : "Chạy Auto-Pilot (Sinh toàn bộ)"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Không gian soạn thảo</label>
        <textarea
          value={currentText}
          onChange={handleChangeText}
          placeholder="Nội dung PC08 sẽ hiện ở đây. Bạn có thể tự gõ, hoặc nhờ AI sinh nội dung..."
          className="flex-1 w-full p-4 border border-slate-300 rounded-xl resize-none font-serif text-sm leading-relaxed text-slate-800 shadow-inner focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Chat / Refine Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
            placeholder="VD: Viết đanh thép hơn, nhấn mạnh dùng xe thang..."
            className="flex-1 border border-slate-300 p-2 rounded-lg text-sm outline-none focus:border-purple-500"
          />
          <button 
            onClick={handleRefine} 
            disabled={loading || !instruction.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16}/> : <MessageSquare size={16}/>}
            Sửa
          </button>
        </div>
      </div>
    </div>
  );
}
