from sqlalchemy import Column, Integer, String, ForeignKey,Boolean
from sqlalchemy.orm import relationship
from models.base import BaseModel

class UserAddress(BaseModel):

    user_id = Column(String(50), nullable=False)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)
    is_active = Column(Boolean)
    address = relationship("Address")

    
