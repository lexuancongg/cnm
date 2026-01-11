from fastapi import *

from typing import List
from mid.admin_mid import checkRoleAdmin
from mid.auth_mid import auth_mid
from schemas.userAddress_schema import *
from service.userAddressService import *



router = APIRouter()


@router.get("/customer/user-address/default", response_model=AddressDetailVm,dependencies=[Depends(auth_mid)])
def getDefaultAddress(request:Request ,user_address_service :userAddressService = Depends(userAddressService) ):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return user_address_service.getDefaultAddress(customerId=customer_id)




@router.post("/customer/user-address",response_model=UserAddressVm,dependencies=[Depends(auth_mid)])
def createUserAddress(
    request:Request,
    addressPostVm: AddressPostVm,
    user_address_service:UserAddressService = Depends(userAddressService)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return user_address_service.createUserAddress(customerId=customer_id,addressPostVm=addressPostVm)






@router.get("/customer/user-address/addresses",response_model=List[AddressDetailVm],dependencies=[Depends(auth_mid)])
def getUserAddressDetail(
    request:Request,
    user_address_service:UserAddressService = Depends(userAddressService)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return user_address_service.getUserAddressDetail(customerId=customer_id)




@router.put("/customer/user-address/{id}",response_model=None,dependencies=[Depends(auth_mid)])
def chooseDefaultAddress(
    request:Request,
    id:int,
    user_address_service :UserAddressService = Depends(userAddressService)
):
    user = request.session.get("user")

    if not user:
        raise HTTPException(status_code=401, detail="Unauthenticated")
    customer_id = user["sub"]
    user_address_service.chooseDefaultAddress(customerId=customer_id,id=id)



@router.delete("/customer/user-address/{id}",dependencies=[Depends(auth_mid)])
def deleteAddress(
    request:Request,
    id:int,
    user_address_service:UserAddressService = Depends(userAddressService)
):
    user = request.session.get("user")

    if not user:
        raise HTTPException(status_code=401, detail="Unauthenticated")
    customer_id = user["sub"]
    user_address_service.deleteAddress(id=id,customerId=customer_id)


