# main.py
from fastapi import FastAPI, Request,Query,Depends, HTTPException,Path
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
from db.session import SessionLocal
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
CLIENT_SECRET = "B9JECyEI7BKAKGeG7fOLssGKYXXPLxXr"
REDIRECT_URI = "http://localhost:8000/auth"
FRONTEND_URL = "http://localhost:3000"



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    }

    
   
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
    