from sqlalchemy.orm import Session
from fastapi import *
from models.district import *
from db.session import get_db
from schemas.district_schema import *
class DistrictService:
    def __init__(self,db:Session):
        self.db = db
    

    def getProvincesByCountryId(self,countryId:int )->list[DistrictGetVm]:
        districts:list[District] = (
            self.db.query(District).all()
        )
        return [DistrictGetVm.from_model(district) for district in districts ]


   

def districtService(db:Session =Depends(get_db)):
    return DistrictService(db)
        
