from sqlalchemy import Column, String, Integer, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class CartItem(Base):
    __tablename__ = "cart_item"
    customer_id = Column(String, primary_key=True)
    product_id = Column(Integer, primary_key=True)
    quantity = Column(Integer, nullable=False)

    __table_args__ = (
        PrimaryKeyConstraint('customer_id', 'product_id'),
    )
