from fastapi import *
from schemas.order_schema import *
from service.orderService import *

router = APIRouter()



    

@router.post("/customer/orders",response_model=None)
def createOrder(
    request:Request,
    orderPostVm :OrderPostVm,
    order_service:OrderService = Depends(orderService)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    
    return order_service.createOrder(orderPostVm=orderPostVm,customerId=customer_id)







@router.get("/customer/orders/my-orders",response_model=List[OrderVm])
def getMyOrders(
    request:Request,
    orderStatus: Optional[OrderStatus] = Query(None),
    order_service:OrderService = Depends(orderService)
):
    

    user = request.session.get("user")

    if not user:
        raise HTTPException(status_code=401, detail="Unauthenticated")
    customer_id = user["sub"]

    return order_service.getMyOrders(customerId=customer_id,orderStatus=orderStatus)
    