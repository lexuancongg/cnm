from sqlalchemy.orm import Session
from fastapi import *
from models.country import *
from db.session import get_db
from schemas.country_schema import *
from service.addressService import *
class CountryService:
    def __init__(self,db:Session):
        self.db = db
    
    def getCountries(self)->list[CountryGetVm]:
        countries:list[Country] = (
            self.db.query(Country).all()
        )
        return [CountryGetVm.from_model(country) for country in countries]

   

def countryService(db:Session =Depends(get_db)):
    return CountryService(db)
        
