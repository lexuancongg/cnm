from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.models.base import BaseModel  

class Category(BaseModel):
    name = Column(String(200), nullable=False)
    description = Column(String(500), nullable=True)
    slug = Column(String(200), nullable=True)
    is_public = Column(Boolean, default=True)
    image_id = Column(Integer, nullable=True)


    product_categories = relationship("ProductCategory", backref="category", cascade="all, delete-orphan")
