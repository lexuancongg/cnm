from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.base import BaseModel

class District(BaseModel):
    name = Column(String(450), nullable=False)

    province_id = Column(Integer, ForeignKey("province.id"), nullable=False)
    province = relationship("Province", back_populates="districts")
