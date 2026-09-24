from fastapi import APIRouter, HTTPException
from app.schemas.input_schema import PcccCalcRequest
from app.schemas.output_schema import PcccCalcResponse
from app.services import calc_service

router = APIRouter()

@router.post("/calculate", response_model=PcccCalcResponse)
def calculate_hydraulics(request: PcccCalcRequest):
    """
    Tính toán các thông số thủy lực chữa cháy:
    - Bán kính, diện tích đám cháy
    - Lưu lượng nước chữa cháy và làm mát
    - Số lượng lăng, số lượng xe cần thiết
    """
    try:
        return calc_service.calculate_fire_parameters(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
