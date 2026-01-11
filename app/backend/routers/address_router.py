from fastapi import *
from mid.auth_mid import auth_mid
from helper.owned_mid import get_owned_entity
from models.userAddress import UserAddress

from schemas.address_schema import *
from service.addressService import *


router = APIRouter()




@router.get("/customer/address/{id}",response_model=AddressDetailVm,dependencies=[Depends(auth_mid)])
def getAddress(
    id:int,
    address_service :AddressService = Depends(addressService)

):
    return address_service.getAddressById(id=id)







@router.put("/customer/addresses/{id}",response_model=None,dependencies=[Depends(auth_mid)])
def updateAddress(
    id:int,
    addressPostVm:AddressPostVm,
    address_service:AddressService = Depends(addressService)
):
    address_service.updateAddress(addressPostVm=addressPostVm,id=id)
