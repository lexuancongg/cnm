from fastapi import *

from schemas.district_schema import *
from service.districtService import *
from typing import List

router = APIRouter()


@router.get("/customer/districts/{provinceId}",response_model= List[DistrictGetVm])
def getDistrictByProvinceId(
    provinceId:int,
    district_service:DistrictService = Depends(districtService)
):
    return district_service.getDictrictByProviceId(provinceId)

