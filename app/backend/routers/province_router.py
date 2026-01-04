from fastapi import *

from schemas.province_schema import *
from service.province_service import *
from typing import List
router = APIRouter()




@router.get("/customer/provinces/{countryId}",response_model=List[ProvinceGetVm])
def getProvincesByCountryId(
    countryId:int,
    province_service:ProvinceService = Depends(provinceService)
):
    return province_service.getProvincesByCountryId(countryId)
