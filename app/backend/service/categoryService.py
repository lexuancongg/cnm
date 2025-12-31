from sqlalchemy.orm import Session
from models.category import Category
from models.image import Image
from typing import List
from schemas.category_schema import CategoryVm
from schemas.image_schema import ImagePreviewVm
filesystem_host = "http://localhost:8000"
class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    def get_categories(self, category_name: str = "") -> List[CategoryVm]:
        query = self.db.query(Category)
        if category_name:
            query = query.filter(Category.name.ilike(f"%{category_name}%"))
        categories = query.all()
        result = []
        for cat in categories:
            image = self.db.query(Image).filter(Image.id == cat.image_id).first() if cat.image_id else None
            image_vm = None
            if image:
                url = f"{filesystem_host}/images/{image.id}/file/{image.file_name}"
                image_vm = ImagePreviewVm(id=image.id, url=url)
            result.append(
                CategoryVm(
                    id=cat.id,
                    name=cat.name,
                    slug=cat.slug,
                    imageCategory=image_vm
                )
            )
        return result


def categoryService(db: Session):
    return CategoryService(db)
