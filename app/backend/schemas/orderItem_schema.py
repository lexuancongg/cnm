from pydantic import BaseModel, Field
from typing import TYPE_CHECKING,Dict
from decimal import Decimal
from models.order import Order
from models.orderItem import OrderItem


class OrderItemPostVm(BaseModel):
    productId: int
    quantity: int
    productName: str
    productPrice: float
    totalPrice: float
    def to_model(self, order: "Order") -> "OrderItem":
        return OrderItem(
            product_id=self.productId,
            quantity=self.quantity,
            product_name=self.productName,
            product_price=self.productPrice,
            total_price=self.totalPrice,
            order=order
        )




class OrderItemVm(BaseModel):
    id: int | None
    productId: int
    quantity: int
    productPrice: Decimal
    totalPrice: Decimal
    orderId: int
    productName: str
    productAvatarUrl: str | None

    @staticmethod
    def from_model(order_item:OrderItem, product_avatar_map: Dict[int, str]):
        return OrderItemVm(
            id=order_item.id,
            productId=order_item.product_id,
            quantity=order_item.quantity,
            productPrice=order_item.product_price,
            totalPrice=order_item.total_price,
            orderId=order_item.order_id,  
            productName=order_item.product_name,
            productAvatarUrl=product_avatar_map.get(order_item.product_id)
        )
