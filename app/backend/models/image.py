from sqlalchemy import Column, Integer, String
from models.base import BaseModel  

class Image(BaseModel):

    description = Column(String(255), nullable=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    image_type = Column(String(50), nullable=True)
