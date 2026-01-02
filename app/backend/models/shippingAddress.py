from sqlalchemy import Column, Integer, String
from models.base import BaseModel 
class ShippingAddress(BaseModel):
    customer_name = Column(String(255), nullable=False)
    phone_number = Column(String(25), nullable=False)
    specific_address = Column(String(450), nullable=False)
    district_id = Column(Integer, nullable=False)
    province_id = Column(Integer, nullable=False)
    country_id = Column(Integer, nullable=False)
