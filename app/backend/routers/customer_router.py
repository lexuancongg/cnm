from fastapi import *
from schemas.customer_schema import *

from service.customerService import *

router = APIRouter()




@router.get("/api/customers/profile",response_model=CustomerVm)
async def  getCustomerProfile(request:Request,customer_service:CustomerService = Depends(customerService)):
   return customer_service.get_customer_profile(request)





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



@router.get("/api/customer/backoffice/customers",response_model=CustomerPagingVm)
def getAllCustomer(
    pageNo:int  = Query(0),
    customer_service:CustomerService = Depends(customerService)
):
    return customer_service.getCustomers(pageNo)




    
@router.post("/api/customer/backoffice/customers",response_model=None)
def createUser(
    customerPostVm:CustomerCreateVm,
    customer_servicee:CustomerService = Depends(customerService)
):
    return customer_servicee.createCustomer(customerPostVm=customerPostVm)


@router.get("/api/customer/backoffice/customers/profile/{id}",response_model=CustomerVm)
def getCustomerById(
    id:str= Path(...),
    customer_servicee:CustomerService = Depends(customerService)
):
    return customer_servicee.getCustomerById(id)


@router.put("/api/customer/backoffice/customers/profile/{id}",response_model=None)
def updateProfileById(
    customerPutVm:CustomerUpdateVm,
    id:str= Path(...),
    customer_servicee:CustomerService = Depends(customerService)

):
    return customer_servicee.updateCustomerById(id=id,customerPutVm=customerPutVm)



