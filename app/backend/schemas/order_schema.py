from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List
from models.order import Order, OrderStatus, PaymentStatus, PaymentMethod
from models.shippingAddress import ShippingAddress
from schemas.shippingAddress_schema import *
from schemas.orderItem_schema import *

class OrderPostVm(BaseModel):
    checkoutId: int = Field(...)
    email: str = Field(...)
    note: str | None = None
    numberItem: int
    totalPrice: float = Field(...)
    orderItemPostVms: List[OrderItemPostVm] = Field(...)
    shippingAddress: ShippingAddressPostVm = Field(...)
    paymentMethod: PaymentMethod = Field(...)

    def to_model(self) -> Order:
        shipping_address_model: ShippingAddress = self.shippingAddress.to_model()
        return Order(
            email=self.email,
            note=self.note,
            number_item=self.numberItem,
            total_price=self.totalPrice,
            shipping_address=shipping_address_model,
            order_status=OrderStatus.PENDING,
            checkout_id=self.checkoutId,
            payment_status=PaymentStatus.UNPAID,
            payment_method=self.paymentMethod
        )
