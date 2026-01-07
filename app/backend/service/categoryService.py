from sqlalchemy.orm import Session
from models.category import Category
from models.image import Image
from typing import List
from sqlalchemy import or_
from schemas.category_schema import *
from schemas.image_schema import ImagePreviewVm
from service.imageService import ImageService
from fastapi import *
filesystem_host = "http://localhost:8000"



class CategoryService:
    def __init__(self, db: Session , image_service: ImageService):
        self.db = db
        self.image_service  = image_service

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
                url = self.image_service.get_image_by_id(image.id).url
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





    def createCategory(self, categoryPostVm: CategoryPostVm) -> CategoryVm:
        exists = (
            self.db.query(Category)
            .filter(
                or_(
                    Category.name == categoryPostVm.name,
                    Category.slug == categoryPostVm.slug
                )
            )
            .first()
        )

        if exists:
            raise HTTPException(
                status_code=400,
                detail="Category name or slug already exists"
            )

        category = Category()
        category.name = categoryPostVm.name
        category.slug = categoryPostVm.slug
        category.description = categoryPostVm.description
        category.image_id = categoryPostVm.imageId

        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)

    

    def deleteCategory(self, id: int):
        category = self.db.query(Category).filter(Category.id == id).first()

        if not category:
            raise HTTPException(404, "Category not found")

        if category.product_categories:
            raise HTTPException(
                status_code=400,
                detail="Category is being used by products"
            )

        self.db.delete(category)
        self.db.commit()


    def getCategoryById(self,id:int)->CategoryVm:
        category = self.db.query(Category).filter(Category.id == id).first()

        if not category:
            raise HTTPException(404, "Category not found")
        image = self.db.query(Image).filter(Image.id == category.image_id).first() if category.image_id else None
        image_vm = None
        if image:
            url = self.image_service.get_image_by_id(image.id).url
            image_vm = ImagePreviewVm(id=image.id, url=url)
        return CategoryVm(
            id=category.id,
            imageCategory=image_vm,
            imageId=category.image_id,
            name=category.name,
            slug=category.slug,
            description= category.description

        )

    def updateCategory(self,id:int,categoryPostVm:CategoryPostVm):
        category = self.db.query(Category).filter(Category.id == id).first()

        if not category:
            raise HTTPException(404, "Category not found")

        exists = (
            self.db.query(Category)
            .filter(
                Category.id != id,
                or_(
                    Category.name == categoryPostVm.name,
                    Category.slug == categoryPostVm.slug
                )
            )
            .first()
        )

        if exists:
            raise HTTPException(
                status_code=400,
                detail="Category name or slug already exists"
            )

        category.name = categoryPostVm.name
        category.slug = categoryPostVm.slug
        category.description = categoryPostVm.description
        category.image_id = categoryPostVm.imageId

        self.db.commit()
        self.db.refresh(category)


        



def categoryService(db: Session):
    image_service  = ImageService(db)
    return CategoryService(db,image_service) 
