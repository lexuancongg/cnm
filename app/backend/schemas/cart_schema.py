
from pydantic import BaseModel, Field

class CartItemPostVm(BaseModel):
    productId: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1)


class CartItemGetVm(BaseModel):
    customerId: str
    productId: int
    quantity: int

class CartItemDetailVm(BaseModel):
    productId: int
    quantity: int
    productName: str
    slug: str
    avatarUrl: str
    price: float



class CartItemPostVm(BaseModel):
    quantity : int
    productId :int


class CartItemPutVm(BaseModel):
    quantity: int = Field(..., ge=1)