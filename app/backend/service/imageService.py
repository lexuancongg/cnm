from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO
import os
from pathlib import Path
from schemas.image_schema import ImageDetailVm
from fastapi import *
from pathlib import Path


filesystem_host = "http://localhost:8000"
class ImageService:
    BASE_DIR = Path("image")
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

    
    def save_media(
        self,
        caption: Optional[str],
        file: UploadFile,
        file_name_override: Optional[str],
    )->Image:
        image:Image = Image()
        image.description = caption
        image.image_type = file.content_type
        if file_name_override and file_name_override.strip():
            file_name = file_name_override.strip()
        else:
            file_name = file.filename

        image.file_name = file_name
        content = file.file.read()
        file_path = self._persist_file(file_name, content)
        image.file_path = file_path
        self.db.add(image)
        self.db.commit()
        self.db.refresh(image)
        return image
    

    def _persist_file(self, filename: str, content: bytes) -> str:
        self._check_existing_directory()
        self._check_permissions()

        file_path = self._build_file_path(filename)
        file_path.write_bytes(content)
        return str(file_path)

    def _build_file_path(self, filename: str) -> Path:
        if ".." in filename or "/" in filename or "\\" in filename:
            raise ValueError("Invalid filename")

        file_path = (self.BASE_DIR / filename).resolve()

        if not str(file_path).startswith(str(self.BASE_DIR.resolve())):
            raise ValueError("Invalid file path")

        return file_path

    def _check_existing_directory(self):
        if not self.BASE_DIR.exists():
            raise RuntimeError(f"Directory {self.BASE_DIR} does not exist.")

    def _check_permissions(self):
        if not os.access(self.BASE_DIR, os.R_OK | os.W_OK):
            raise RuntimeError(f"Directory {self.BASE_DIR} is not accessible.")
    
def imageService(db: Session):
    return ImageService(db)
