from sqlalchemy import Column, Integer, String, DateTime, PrimaryKeyConstraint
from models.base import Base
import datetime

class CartItem(Base):
    __tablename__ = "cartitem"

    customer_id = Column(String(50))
    product_id = Column(Integer)
    quantity = Column(Integer, nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    created_by = Column(String(100))
    last_updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_updated_by = Column(String(100))

    __table_args__ = (
        PrimaryKeyConstraint('customer_id', 'product_id'),
    )
