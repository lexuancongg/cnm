from fastapi import *
from service.countryService import *
from schemas.country_schema import *
from typing import List
router = APIRouter()


@router.get("/customer/countries",response_model=List[CountryGetVm])
def getCountries(country_service :CountryService = Depends(countryService)):
    return country_service.getCountries()
