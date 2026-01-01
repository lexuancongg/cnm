from pydantic import BaseModel,conlist,Field,PositiveInt,ConfigDict
from decimal import Decimal
from typing import List,Optional
from models.checkout import Checkout,CheckoutStatus
from models.checkoutItem import CheckoutItem
from schemas.product_schema import ProductPreviewVm

class CheckoutItemVm(BaseModel):
    id: int
    productId: int
    quantity: int
    productName: str
    productPrice: float

   
    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_model(cls, checkout_item: CheckoutItem) -> "CheckoutItemVm":
        return cls(
            id=checkout_item.id,
            productId=checkout_item.product_id,
            quantity=checkout_item.quantity,
            productName=checkout_item.product_name,
            productPrice=checkout_item.price
        )



class CheckoutVm(BaseModel):
    id: int
    email: str
    note: Optional[str]
    checkoutItemVms: List[CheckoutItemVm]  # list các item


    @classmethod
    def from_model(cls, checkout: Checkout) -> "CheckoutVm":
        checkout_items = [
            CheckoutItemVm.from_model(item)
            for item in checkout.checkout_items 
        ]
        return cls(
            id=checkout.id,
            email=checkout.email,
            note=checkout.note,
            checkoutItemVms=checkout_items
        )


class CheckoutItemPostVm(BaseModel):
    productId: int
    quantity: PositiveInt  
    model_config = ConfigDict(from_attributes=True)

    def to_model(self, checkout: Checkout, product_preview_vm: ProductPreviewVm) -> CheckoutItem:
        return CheckoutItem(
            product_id=self.productId,
            quantity=self.quantity,
            checkout=checkout,
            price=product_preview_vm.price, 
            product_name=product_preview_vm.name  
        )

    



class CheckoutPostVm(BaseModel):
    email: str
    checkoutItemPostVms: List[CheckoutItemPostVm] = Field(
    ..., min_length=1, description="Checkout Items must not be empty")
    totalPrice: float
    note:str

    model_config = ConfigDict(from_attributes=True)


    def to_model(self) -> Checkout:
        return Checkout(
            total_price=self.totalPrice,
            email=self.email,
            checkout_status=CheckoutStatus.PENDING,
            note = self.note
            
        )