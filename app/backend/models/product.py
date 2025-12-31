from sqlalchemy import Column, String, Integer, BigInteger, Boolean, Float, Numeric, ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from models.base import  BaseModel


class Product(BaseModel):

    name = Column(String(255), nullable=False)
    description = Column(String(255))
    specifications = Column(String(255))
    slug = Column(String(255))
    price = Column(Numeric(15, 2))
    is_public = Column(Boolean, default=True)
    is_feature = Column(Boolean, default=False)
    avatar_image_id = Column(BigInteger)
    author_id = Column(Integer, ForeignKey("author.id"))
    author = relationship("Author", back_populates="products")


    product_categories = relationship("ProductCategory", back_populates="product", cascade="save-update, merge")

    # product_attribute_values = relationship("ProductAttributeValue", back_populates="product")

    product_images = relationship("ProductImage", back_populates="product", cascade="save-update, merge")
