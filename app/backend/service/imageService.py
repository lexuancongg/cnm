from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO
from pathlib import Path


class ImageService:
    def __init__(self, db: Session):
        self.db = db

    def get_file(self, id: int, file_name: str) -> Optional[tuple[IO, str]]:
        image = self.db.query(Image).filter(Image.id == id).first()
        if not image or image.file_name.lower() != file_name.lower():
            return None
        
        path = Path(image.file_path)
        if not path.exists():
            return None
        
        return path.open("rb"), image.image_type 
    
def imageService(db: Session):
    return ImageService(db)
