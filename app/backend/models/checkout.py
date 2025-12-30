from sqlalchemy import Column, String, Integer, ForeignKey, Numeric, Enum
from sqlalchemy.orm import relationship
from backend.models.base import BaseModel
from enum import Enum as PyEnum
from decimal import Decimal

class CheckoutStatus(PyEnum):
    PENDING = "PENDING"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

class Checkout(BaseModel):
    email = Column(String(200), nullable=True)
    note = Column(String(500), nullable=True)
    total_price = Column(Numeric(12, 2), default=Decimal('0.00'))
    customer_id = Column(String, nullable=True)
    checkout_status = Column(Enum(CheckoutStatus), default=CheckoutStatus.PENDING)

    checkout_items = relationship(
        "CheckoutItem",
        back_populates="checkout",
        cascade="all, delete-orphan"
    )
