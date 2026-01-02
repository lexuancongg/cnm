from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Enum,Float
from sqlalchemy.orm import relationship
from models.base import BaseModel
import enum
from datetime import datetime

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"
    REFUNDED = "REFUNDED"

class PaymentMethod(str, enum.Enum):
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    PAYPAL = "PAYPAL"

class Order(BaseModel):

    email = Column(String(255), nullable=False)
    note = Column(String(500), nullable=True)

    shipping_address_id = Column(Integer, ForeignKey("shippingaddress.id"))
    shipping_address = relationship("ShippingAddress", lazy="joined", cascade="all, delete")

    number_item = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    customer_id = Column(String(50), nullable=False)

    order_status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    payment_method = Column(Enum(PaymentMethod),default=PaymentMethod.PAYPAL)

    payment_id = Column(Integer, nullable=True)
    checkout_id = Column(Integer, nullable=True)

    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

   