from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel

class Province(BaseModel):
    name = Column(String(450), nullable=False)

    country_id = Column(Integer, ForeignKey("country.id"), nullable=False)
    country = relationship("Country", back_populates="provinces")
    districts = relationship("District", back_populates="province")