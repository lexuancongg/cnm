from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship, backref
from models.base import BaseModel

class Author(BaseModel):
    __tablename__ = "author"
    name = Column(String(255), nullable=False)
    is_public = Column(Boolean, default=True)
    

    products = relationship("Product", back_populates="author", cascade="all, delete-orphan")
