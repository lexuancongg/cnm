from models.base import BaseModel
from datetime import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, Numeric, Enum


class Feedback(BaseModel):
    content = Column(String(100), nullable=True)
    star = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=True)
    last_name = Column(String(50), nullable=True)
    first_name = Column(String(50), nullable=True)
    product_name = Column(String(200),nullable=False)

