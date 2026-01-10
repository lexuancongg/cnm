from pydantic import BaseModel, Field
from decimal import Decimal
from typing import List,Dict
from models.order import Order, OrderStatus, PaymentStatus, PaymentMethod
from models.shippingAddress import ShippingAddress
from schemas.shippingAddress_schema import *
from schemas.orderItem_schema import *
from schemas.shippingAddress_schema import *
from datetime import datetime

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




class OrderVm(BaseModel):
    id: int
    email: str
    shippingAddressVm: ShippingAddressVm
    note: Optional[str]
    numberItem: int
    totalPrice: Decimal
    orderStatus: OrderStatus
    orderItemVms: List[OrderItemVm]
    checkoutId: Optional[int]
    paymentMethod: PaymentMethod
    paymentStatus:Optional[PaymentStatus] = None 
    createdAt: datetime

    @staticmethod
    def from_model(
        order:Order,
        order_items: Optional[list],
        shipping_address_vm: ShippingAddressVm,
        product_avatar_map: Dict[int, str]
    ):
        order_item_vms = [
            OrderItemVm.from_model(item, product_avatar_map)
            for item in (order_items or [])
        ]

        return OrderVm(
            id=order.id,
            email=order.email,
            shippingAddressVm=shipping_address_vm,
            note=order.note,
            numberItem=order.number_item,
            totalPrice=order.total_price,
            orderStatus=order.order_status,
            orderItemVms=order_item_vms,
            checkoutId=order.checkout_id,
            paymentMethod=order.payment_method,
            createdAt=order.created_at,
            paymentStatus=order.payment_status,
        )

class CheckUserHasBoughtProductCompletedVm(BaseModel):
    hasPurchased: bool



class OrderBriefVm(BaseModel):
    id: int
    email: str
    shippingAddressVm: Optional[ShippingAddressVm] = None
    totalPrice: Decimal
    orderStatus: OrderStatus
    paymentMethod:PaymentMethod
    paymentStatus: PaymentStatus
    createdOn: datetime

    @staticmethod
    def from_model(order:Order):
        return OrderBriefVm(
          paymentStatus=order.payment_status,
          createdOn=order.created_at,
          email=order.email,
          id=order.id,
          orderStatus=order.order_status,
          shippingAddressVm=ShippingAddressVm.from_model(order.shipping_address),
          totalPrice=order.total_price,
          paymentMethod=order.payment_method
        )
    


