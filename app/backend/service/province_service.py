from sqlalchemy.orm import Session
from fastapi import *
from models.province import *
from db.session import get_db
from schemas.province_schema import *
class ProvinceService:
    def __init__(self,db:Session):
        self.db = db
    

    def getProvincesByCountryId(self,countryId:int )->list[ProvinceGetVm]:
        provinces:list[Province] = (
            self.db.query(Province).all()
        )
        return [ProvinceGetVm.from_model(province) for province in provinces ]


   

def provinceService(db:Session =Depends(get_db)):
    return ProvinceService(db)
        
