from sqlalchemy import create_engine
from models.base import BaseModel , Base
from sqlalchemy.orm import sessionmaker
DATABASE_URL = "mysql+pymysql://root:rootpass@localhost:3306/e-commerce"
from models import address, category, checkout , checkoutItem, district , province, country, image, product,author,productCategory,userAddress,productImage,cartItem,shippingAddress,order,orderItem

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)
Base.metadata.create_all(engine) 
BaseModel.metadata.create_all(engine)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)




def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



