# main.py
from fastapi import FastAPI, Request,Query,Depends, HTTPException,Path
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from db.session import get_db
from typing import List
from schemas.category_schema import CategoryVm
from schemas.authentication_schema import AuthenticatedUserVm,AuthenticationInfoVm
from service.categoryService import categoryService
from service.imageService import imageService
from schemas.product_schema import ProductPreviewPagingVm, ProductDetailVm
from service.productService import productService
from schemas.cart_schema import CartItemDetailVm,CartItemGetVm,CartItemPostVm, CartItemPutVm
from models.cartItem import CartItem
from service.cartService import cartService
from schemas.checkout_schema import CheckoutPostVm,CheckoutVm
from service.checkoutService import checkoutService
from schemas.address_schema import AddressDetailVm
from service.userAddressService import *
from schemas.country_schema import *
from service.countryService import *
from schemas.province_schema import *
from service.province_service import *
from schemas.district_schema import *
from service.districtService import *
from schemas.userAddress_schema import *
from schemas.order_schema import *
from service.orderService import *
from schemas.payment_schema import *
from service.paypalPayment_service import *
from schemas.customer_schema import *
from service.customerService import *



app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="!secret")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Config Keycloak
KEYCLOAK_SERVER = "http://localhost:8080/realms/ecommerce"
CLIENT_ID = "xuancong-ecommerce"
CLIENT_SECRET = "y3BkvJfZ8BpR4jdWsHuBu5XIjOLpRAB7"
REDIRECT_URI = "http://localhost:8000/auth"
FRONTEND_URL = "http://localhost:3000"



oauth = OAuth()
oauth.register(
    name="keycloak",
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url=f"{KEYCLOAK_SERVER}/.well-known/openid-configuration",
    client_kwargs={"scope": "openid roles"},
)

@app.get("/login")
async def login(request: Request):
    return await oauth.keycloak.authorize_redirect(request, REDIRECT_URI)

@app.get("/auth")
async def auth(request: Request):
    token = await oauth.keycloak.authorize_access_token(request)
    access_token = token["access_token"]
    refresh_token = token["refresh_token"]
    user = token["userinfo"]
    id_token = token["id_token"]

    request.session["user"] = {
        "sub": user["sub"],
        "username": user["preferred_username"],
        "email": user["email"],
        "name": user["name"],
        "firstname": user["given_name"],
        "lastname":user["family_name"]
    }
    request.session["access_token"] = token["access_token"]
    request.session["refresh_token"] = token["refresh_token"]


    
   
    return RedirectResponse(FRONTEND_URL)



@app.get("/authentication", response_model=AuthenticationInfoVm)
async def authentication(request: Request):
    user = request.session.get("user")
    
    if not user:
        return AuthenticationInfoVm(isAuthenticated=False, authenticatedUser=None)
    
    authenticated_user = AuthenticatedUserVm(username=user["username"])
    return AuthenticationInfoVm(isAuthenticated=True, authenticatedUser=authenticated_user)



@app.get("/api/customer/categories", response_model=List[CategoryVm])
def api_get_categories(category_name: str = Query("", alias="categoryName"), db: Session = Depends(get_db)):
    service = categoryService(db)
    return service.get_categories(category_name)




@app.get("/images/{id}/file/{file_name}")
def get_file(id: int, file_name: str, db: Session = Depends(get_db)):
    service = imageService(db)
    result = service.get_file(id, file_name)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    
    stream, media_type = result
    return StreamingResponse(
        stream,
        media_type=media_type,
        headers={"Content-Disposition": f'attachment; filename="{file_name}"'}
    )


@app.get("/api/product/customer/products/featured", response_model=ProductPreviewPagingVm)
def get_featured_products_paging(
    pageIndex: int = Query(0),
    pageSize: int = Query(10),
    db: Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.get_featured_products_paging(pageIndex, pageSize)


@app.get("/cart/customer/cart-items", response_model= List[CartItemDetailVm])
def getCartItems(request:Request, db: Session = Depends(get_db)):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]  
    cart_service = cartService(db)
    return cart_service.getCartItems(customer_id= customer_id)
    
  

@app.get("/api/product/customer/products/{slug}", response_model=ProductDetailVm)
async def get_product_detail(db:Session = Depends(get_db),slug: str = Path(..., description="product slug")):
    product_service = productService(db)
    return product_service.getProductDetailBySlug(slug)
    
    
@app.post("/cart/customer/cart-items", response_model=CartItemGetVm)
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

    

@app.put("/cart/customer/cart-items/{product_id}")
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
    
    
@app.delete("/cart/customer/cart-items/{product_id}")
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

    

@app.post("/customer/checkouts")
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
    

@app.get("/customer/checkouts/{id}",response_model= CheckoutVm)
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


@app.get("/customer/user-address/default", response_model=AddressDetailVm)
def getDefaultAddress(request:Request ,user_address_service :userAddressService = Depends(userAddressService) ):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return user_address_service.getDefaultAddress(customerId=customer_id)




@app.get("/customer/countries",response_model=List[CountryGetVm])
def getCountries(country_service :CountryService = Depends(countryService)):
    return country_service.getCountries()

    



@app.get("/customer/provinces/{countryId}",response_model=List[ProvinceGetVm])
def getProvincesByCountryId(
    countryId:int,
    province_service:ProvinceService = Depends(provinceService)
):
    return province_service.getProvincesByCountryId(countryId)


@app.get("/customer/districts/{provinceId}",response_model= List[DistrictGetVm])
def getDistrictByProvinceId(
    provinceId:int,
    district_service:DistrictService = Depends(districtService)
):
    return district_service.getDictrictByProviceId(provinceId)


@app.post("/customer/user-address",response_model=UserAddressVm)
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



@app.get("/customer/user-address/addresses",response_model=List[AddressDetailVm])
def getUserAddressDetail(
    request:Request,
    user_address_service:UserAddressService = Depends(userAddressService)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    customer_id = user["sub"]
    return user_address_service.getUserAddressDetail(customerId=customer_id)


@app.post("/customer/orders",response_model=None)
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




@app.post("/init",response_model=InitPaymentResponse)
def initPayment(
    initPaymentRequest: InitPaymentRequest,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.create_payment(initPaymentRequest)





@app.post("/capture",response_model=CapturePaymentResponseVm)
def capturePaypalPayment(
    capturePaymentRequest:CapturePaymentRequestVm,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.capturePaymentPaypal(capturePaymentRequest= capturePaymentRequest)


@app.get("/api/customers/profile",response_model=CustomerVm)
async def  getCustomerProfile(request:Request):
    user = request.session.get("user")
    print(user)

    if not user:
        raise HTTPException(status_code=401, detail="Unauthenticated")

    return CustomerVm.from_keycloak_user(user)




@app.put("/customer/profile",response_model=None)
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




@app.put("/customer/user-address/{id}",response_model=None)
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


@app.get("/customer/address/{id}",response_model=AddressDetailVm)
def getAddress(
    request:Request,
    id:int,
    address_service :AddressService = Depends(addressService)

):
    return address_service.getAddressById(id=id)
    