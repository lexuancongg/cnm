from fastapi import *

from mid.auth_mid import auth_mid
from schemas.checkout_schema import *
from db.session import get_db
from service.checkoutService import *
from sqlalchemy.orm import Session


router = APIRouter()

    
@router.post("/customer/checkouts",dependencies=[Depends(auth_mid)])
def createCheckout(
    request:Request,
    checkoutPostVm:CheckoutPostVm,
    db:Session = Depends(get_db)
)->CheckoutVm:
    user = request.session.get("user")
    checkout_service = checkoutService(db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    return checkout_service.createCheckout(checkoutPostVm=checkoutPostVm,customerId=customer_id)
    



@router.get("/customer/checkouts/{id}",response_model= CheckoutVm,dependencies=[Depends(auth_mid)])
def getCheckoutById(
    request:Request,
    id:int,
    db:Session = Depends(get_db)

):
    user = request.session.get("user")
    checkout_service = checkoutService(db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return checkout_service.getCheckoutById(customerId=customer_id , id=id)

