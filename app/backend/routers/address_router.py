from fastapi import *
from schemas.address_schema import *
from service.addressService import *


router = APIRouter()





@router.get("/customer/address/{id}",response_model=AddressDetailVm)
def getAddress(
    request:Request,
    id:int,
    address_service :AddressService = Depends(addressService)

):
    return address_service.getAddressById(id=id)







@router.put("/customer/addresses/{id}",response_model=None)
def updateAddress(
    id:int,
    addressPostVm:AddressPostVm,
    address_service:AddressService = Depends(addressService)
):
    address_service.updateAddress(addressPostVm=addressPostVm,id=id)
