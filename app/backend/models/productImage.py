from sqlalchemy import Column, Integer, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from models.base import BaseModel 

class ProductImage(BaseModel):

    image_id = Column(BigInteger, nullable=False)

    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    product = relationship("Product", back_populates="product_images")
