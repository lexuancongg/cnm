from models.image import Image
from sqlalchemy.orm import Session
from typing import Optional, IO,List
from pathlib import Path
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm
from service.imageService import ImageService


class ProductService:
    def __init__(self, db: Session, image_service:ImageService):
        self.db = db
        self.image_service = image_service
    def get_featured_products_paging( self ,page_index : int, page_size:int):
        query = (
            self.db.query(Product)
            .filter(
            Product.is_feature == True,
            Product.is_public == True
            )
            .order_by(Product.id.asc())
        )
        total_elements = query.count()
        total_pages = (total_elements + page_size - 1) // page_size
        products = (
            query
            .offset(page_index * page_size)
            .limit(page_size)
            .all()
            
        )
        productPreviewPayload = [
            ProductPreviewVm(id=p.id , name=p.name, slug=p.slug, price=p.price, 
                             avatarUrl= self.image_service.get_image_by_id(p.avatar_image_id).url ) for p in  products

        ]
        return ProductPreviewPagingVm(
            productPreviewsPayload=productPreviewPayload,
            pageIndex=page_index,
            pageSize=page_size,
            totalElements=total_elements,
            totalPages=total_pages,
            isLast=(page_index + 1) >= total_pages
    )



    def getProductsByIds( self, ids: List[int])-> List[ProductPreviewVm]:
        if not ids:
            return []
        products : List[Product] = self.db.query(Product).filter(Product.id.in_(ids)).all()
        result: List[ProductPreviewVm] = []
        for product in products:
            avatar_url = self.image_service.get_image_by_id(product.avatar_image_id).url
            result.append(
                ProductPreviewVm(
                    id=product.id,
                    avatarUrl=avatar_url,
                    name=product.name,
                    price=product.price,
                    slug=product.slug
                )
            )
        
        return result;



    
def productService(db: Session):
    image_service = ImageService(db)
    return ProductService(db,image_service)
