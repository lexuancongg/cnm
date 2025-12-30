from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from models.base import BaseModel

class Country(BaseModel):
    name = Column(String(450), nullable=False)

    provinces = relationship("Province", back_populates="country")
