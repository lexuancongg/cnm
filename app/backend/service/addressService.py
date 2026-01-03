from sqlalchemy.orm import Session
from fastapi import *
from db.session import get_db
from models.userAddress import *
from models.country import *
from models.province import *
from models.district import *
from schemas.address_schema import *
class AddressService:
    def __init__(self,db:Session):
        self.db = db
    

    def getAddressById(self,id:int)->AddressDetailVm:
        address:Address = (
            self.db.query(Address)
            .filter(Address.id ==id)
            .first()
        )
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Address Not Found"
            
            )  
        return AddressDetailVm.from_model(address)
    

    def createAddress(self,addressPostVm: AddressPostVm)->AddressVm:
        address:Address = addressPostVm.to_model()
        country:Country = (
            self.db.query(Country)
            .filter(Country.id == addressPostVm.countryId)
            .first()
        )
        if not country:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="country not found"
            
            )
        province:Province = (
            self.db.query(Province)
            .filter(Province.id == addressPostVm.provinceId)
            .first()
        )
        if not province:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="province not found"
            
            )  
        district:District = (
            self.db.query(District)
            .filter(District.id == addressPostVm.districtId)
            .first()
        )
        if not district:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="district not found"
            
            )  
        
        address.district= district
        address.province=province
        address.country = country
        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)
        return AddressVm.from_model(address)


    def getAddresses( self,ids:list[int])->list[AddressDetailVm]:
        addresses:list[Address] = (
            self.db.query(Address)
            .filter(Address.id.in_(ids))
            .all()
        )
        return [AddressDetailVm.from_model(address) for address in addresses]
    



    def updateAddress(self,id:int,addressPostVm:AddressPostVm):
        address:Address = (
            self.db.query(Address)
            .filter(Address.id ==id)
            .first()
        )
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="address not found"
            
            )  
        address.contact_name = addressPostVm.contactName
        address.phone_number = addressPostVm.phoneNumber
        address.specific_address = addressPostVm.specificAddress

        country:Country = (
            self.db.query(Country)
            .filter(Country.id == addressPostVm.countryId)
            .first()
        )
        if not country:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="country not found"
            
            )
        province:Province = (
            self.db.query(Province)
            .filter(Province.id == addressPostVm.provinceId)
            .first()
        )
        if not province:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="province not found"
            
            )  
        district:District = (
            self.db.query(District)
            .filter(District.id == addressPostVm.districtId)
            .first()
        )
        if not district:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="district not found"
            
            )  
        address.district= district
        address.province=province
        address.country = country
        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)

    def deleteAddress(self,id:int):
        address:Address = (
            self.db.query(Address)
            .filter(Address.id==id)
            .first()
        )
    
        if not address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="address not found"
            
            )  
        self.db.delete(address)
        self.db.commit()


  


def addressService(db:Session =Depends(get_db)):
    return AddressService(db)
        
