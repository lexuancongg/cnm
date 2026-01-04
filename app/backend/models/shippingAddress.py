from sqlalchemy import Column, Integer, String,ForeignKey
from models.base import BaseModel 
from sqlalchemy.orm import relationship
class ShippingAddress(BaseModel):
    customer_name = Column(String(255), nullable=False)
    phone_number = Column(String(25), nullable=False)
    specific_address = Column(String(450), nullable=False)
    country_id = Column(Integer, ForeignKey("country.id"), nullable=False)
    province_id = Column(Integer, ForeignKey("province.id"), nullable=False)
    district_id = Column(Integer, ForeignKey("district.id"), nullable=False)

    country = relationship("Country", lazy="joined")
    province = relationship("Province", lazy="joined")
    district = relationship("District", lazy="joined")