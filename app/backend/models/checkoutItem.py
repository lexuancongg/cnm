from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from models.base import BaseModel

class CheckoutItem(BaseModel):
    product_id = Column(Integer, nullable=False)
    product_name = Column(String(200), nullable=True)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(12, 2), nullable=False)

    checkout_id = Column(Integer, ForeignKey("checkout.id"), nullable=False)
    checkout = relationship("Checkout", back_populates="checkout_items")
