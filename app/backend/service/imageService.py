from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO
from pathlib import Path
from schemas.image_schema import ImageDetailVm
from fastapi import HTTPException

filesystem_host = "http://localhost:8000"
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
    

    def get_image_by_id(self, id: int) -> ImageDetailVm:
        image = self.db.query(Image).filter(Image.id == id).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")

        path = Path(image.file_path)
        if not path.exists():
            raise HTTPException(status_code=404, detail="File not found")

        url = f"{filesystem_host}/images/{image.id}/file/{image.file_name}"

        return ImageDetailVm(
            id=image.id,
            description=image.description,
            fileName=image.file_name,
            imageType=image.image_type,
            url=url
        )

    
    
    
def imageService(db: Session):
    return ImageService(db)
