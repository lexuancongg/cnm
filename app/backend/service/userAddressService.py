from sqlalchemy.orm import Session
from fastapi import *
from models.userAddress import *
from db.session import get_db
from schemas.address_schema import *
from service.addressService import *
from schemas.userAddress_schema import *
class UserAddressService:
    def __init__(self,db:Session, addressService:AddressService):
        self.db = db
        self.addressService = addressService

    def getDefaultAddress( self,customerId:str)-> AddressDetailVm:
        user_address : UserAddress = (
            self.db.query(UserAddress)
            .filter(UserAddress.user_id == customerId,UserAddress.is_active.is_(True))
            .first()
        )
        if not user_address:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Not found address"
            
            )
        return self.addressService.getAddressById(user_address.address_id)
    

    def createUserAddress(self, customerId:str,addressPostVm:AddressPostVm)->UserAddressVm:
        userAddresses : list[UserAddress] = (
            self.db.query(UserAddress)
            .filter(UserAddress.user_id == customerId)
            .all()
        )
        isFirstAddress: bool = not userAddresses
        addressVm : AddressVm = self.addressService.createAddress(addressPostVm)
        userAddress:UserAddress = UserAddress(
            user_id = customerId,
            address_id = addressVm.id,
            is_active = isFirstAddress
        )
        self.db.add(userAddress)
        self.db.commit()
        self.db.refresh(userAddress)
        return UserAddressVm.from_model(address_vm= addressVm ,user_address= userAddress)



    def getUserAddressDetail(self,customerId:str)->list[AddressDetailVm]:
        userAddresses: list[UserAddress] = (
            self.db.query(UserAddress)
            .filter(UserAddress.user_id == customerId)
            .all()
        )
        addressIds: list[int] = [userAddress.address_id for userAddress in userAddresses]
        addressVms : list[AddressDetailVm] = self.addressService.getAddresses(ids=addressIds)
        addressDetailVms: list[AddressDetailVm] = [
            AddressDetailVm(
                id=addressVm.id,
                contactName=addressVm.contactName,
                phoneNumber=addressVm.phoneNumber,
                specificAddress=addressVm.specificAddress,
                districtId=addressVm.districtId,
                districtName=addressVm.districtName,
                provinceId=addressVm.provinceId,
                provinceName=addressVm.provinceName,
                countryId=addressVm.countryId,
                countryName=addressVm.countryName,
                isActive=userAddress.is_active
            )
            for userAddress in userAddresses
            for addressVm in addressVms
            if addressVm.id == userAddress.address_id
        ]

        addressDetailVms.sort(key=lambda x: x.isActive, reverse=True)

        return addressDetailVms

def userAddressService(db:Session =Depends(get_db), address_service:AddressService = Depends(addressService)):
    return UserAddressService(db,address_service)
        
