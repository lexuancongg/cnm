from sqlalchemy import Column, Integer, String, ForeignKey, Numeric,Float
from sqlalchemy.orm import relationship
from datetime import datetime
from models.base import BaseModel

class OrderItem(BaseModel):

    product_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    product_price = Column(Float, nullable=False) 
    total_price = Column(Float, nullable=False)
    product_name = Column(String(255), nullable=False)

    order_id = Column(Integer, ForeignKey("order.id"))
    order = relationship("Order", back_populates="order_items", lazy="joined")
