from sqlalchemy import create_engine
from models.base import BaseModel
from sqlalchemy.orm import sessionmaker
DATABASE_URL = "mysql+pymysql://root:rootpass@localhost:3306/e-commerce"
from models import address, cartItem, category, checkout , checkoutItem, district , province, country, image, product,author,productCategory,productImage

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)
BaseModel.metadata.create_all(engine)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

