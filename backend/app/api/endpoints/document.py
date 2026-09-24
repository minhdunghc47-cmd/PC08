from fastapi import APIRouter, HTTPException, Body
from fastapi.responses import StreamingResponse
from app.schemas.input_schema import FullGenerationRequest, SectionGenerationRequest, RefineSectionRequest
from app.schemas.output_schema import GeneratedPC08Content, SectionGenerationResponse
from app.services import llm_service, docx_service
import urllib.parse

router = APIRouter()

@router.post("/generate-ai-content", response_model=GeneratedPC08Content)
def generate_ai_content(request: FullGenerationRequest):
    """
    Sinh nội dung kịch bản tác chiến PC08 bằng LLM (Gemini).
    Dựa vào thông tin cơ sở và kết quả tính toán thủy lực.
    """
    try:
        return llm_service.generate_pc08_content(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/generate-section", response_model=SectionGenerationResponse)
def generate_section(request: SectionGenerationRequest):
    try:
        from app.schemas.output_schema import SectionGenerationResponse
        text = llm_service.generate_specific_section(request)
        return SectionGenerationResponse(text=text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/refine-section", response_model=SectionGenerationResponse)
def refine_section(request: RefineSectionRequest):
    try:
        from app.schemas.output_schema import SectionGenerationResponse
        text = llm_service.refine_specific_section(request)
        return SectionGenerationResponse(text=text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/export-docx")
def export_docx(context: dict = Body(...)):
    """
    Nhận JSON Context từ frontend, render template PC08 và trả về file Word.
    """
    try:
        file_stream = docx_service.generate_pc08_docx(context)
        
        ten_co_so = context.get("ten_co_so", "Co_so").replace(" ", "_")
        filename = f"Phuong_an_PC08_{ten_co_so}.docx"
        encoded_filename = urllib.parse.quote(filename)
        
        return StreamingResponse(
            file_stream,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={
                "Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
