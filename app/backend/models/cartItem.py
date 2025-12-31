from sqlalchemy import Column, String, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base
from models.base import BaseModel 


Base = declarative_base()

class CartItem(BaseModel):
    
    customer_id = Column(String(50), primary_key=True)
    product_id = Column(Integer, primary_key=True)
    quantity = Column(Integer, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('customer_id', 'product_id'),
    )
