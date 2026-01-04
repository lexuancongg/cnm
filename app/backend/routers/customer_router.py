from fastapi import *
from schemas.customer_schema import *

from service.customerService import *

router = APIRouter()




@router.get("/api/customers/profile",response_model=CustomerVm)
async def  getCustomerProfile(request:Request):
    user = request.session.get("user")
    print(user)

    if not user:
        raise HTTPException(status_code=401, detail="Unauthenticated")

    return CustomerVm.from_keycloak_user(user)





@router.put("/customer/profile",response_model=None)
def updateCustomerProfile(
    request:Request,
    customerPutVm: CustomerProfilePutVm,
    customer_service:CustomerService = Depends(customerService)
):
    user = request.session.get("user")
    customer_id = user["sub"]
    customerPutVm.username = user["username"]
    access_token = request.session.get("access_token")



    if not access_token:
        raise HTTPException(401, "Unauthenticated")
    customer_service.updateCustomer(access_token= access_token, user_id = customer_id, customerPutVm= customerPutVm)


    request.session["user"].update({
        "email": customerPutVm.email,
        "firstname": customerPutVm.firstName,
        "lastname": customerPutVm.lastName
    })

