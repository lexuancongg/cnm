from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel


class Address(BaseModel):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True, index=True)

    contact_name = Column(String(450))
    phone_number = Column(String(25))
    specific_address = Column(String(450))

    district_id = Column(Integer, ForeignKey("district.id"), nullable=False)
    province_id = Column(Integer, ForeignKey("province.id"), nullable=False)
    country_id  = Column(Integer, ForeignKey("country.id"), nullable=False)

    district = relationship("District")
    province = relationship("Province")
    country  = relationship("Country")
