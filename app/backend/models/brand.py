from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.base import BaseModel 

class Brand(BaseModel):
    __tablename__ = "brand"

    name = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    is_public = Column(Boolean, default=True)

    # products = relationship("Product", back_populates="brand", cascade="all, delete-orphan")
