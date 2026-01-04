

from db.session import get_db
from schemas.cart_schema import *

from service.cartService import *

from fastapi import *

router = APIRouter()



@router.get("/cart/customer/cart-items", response_model= List[CartItemDetailVm])
def getCartItems(request:Request, db: Session = Depends(get_db)):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    cart_service = cartService(db)
    return cart_service.getCartItems(customer_id= customer_id)
    
  



    
    
@router.post("/cart/customer/cart-items", response_model=CartItemGetVm)
def add_cart_item(
    request: Request,
    cart_item_post_vm: CartItemPostVm,
    db: Session = Depends(get_db)
):


    user = request.session.get("user")
    cart_service  = cartService(db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    return cart_service.addCartItem(cart_item_post_vm=cart_item_post_vm , customer_id= customer_id)





    

@router.put("/cart/customer/cart-items/{product_id}")
def updateCartItem(
    cartItemPutVm : CartItemPutVm,
    request:Request,
    product_id: int = Path(..., gt=0),
    db:Session = Depends(get_db)
    
)-> CartItemGetVm:
    user = request.session.get("user")
    cart_service  = cartService(db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    return cart_service.updateCartItem(cartItemPutVm=cartItemPutVm,customerId=customer_id,productId=product_id)
    



@router.delete("/cart/customer/cart-items/{product_id}")
def deleteCartItem(
    request:Request,
    product_id: int = Path(..., gt=0),
    db:Session = Depends(get_db)
)->None:
    user = request.session.get("user")
    cart_service  = cartService(db)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    return cart_service.deleteCartItem(customerId=customer_id,productId=product_id)

    
