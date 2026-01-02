from pydantic import BaseModel, Field
from typing import TYPE_CHECKING
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
