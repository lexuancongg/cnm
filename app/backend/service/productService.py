from sqlalchemy.orm import Session
from typing import Optional, IO,List
from decimal import Decimal
from models.product import Product
from schemas.product_schema import ProductPreviewPagingVm, ProductPreviewVm,ProductDetailVm,ProductListGetFromCategoryVm,ProductPostVm,ProductVm
from service.imageService import ImageService
from fastapi import HTTPException,status
from sqlalchemy import func, desc
from models.orderItem import *
from schemas.image_schema import ImagePreviewVm
from models.productImage import ProductImage
from models.author import Author
from models.productCategory import ProductCategory
from models.category import Category
from schemas.category_schema import CategoryVm
from sqlalchemy.exc import IntegrityError

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


    def getProductDetailBySlug(self , slug:str)->ProductDetailVm:
        product:Product = self.db.query(Product).filter(Product.slug == slug).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {slug}")
        
        avatar_url : str = self.image_service.get_image_by_id(product.avatar_image_id).url
        image_ids = [ img.image_id for img in product.product_images]
        product_image_urls = [self.image_service.get_image_by_id(image_id).url for image_id in image_ids]
        author_name = product.author.name

        categories =  [category.category.name for category in product.product_categories]
        return ProductDetailVm(
            id=product.id,
            name=product.name,
            authorName=author_name,
            categories=categories,
            description=product.description,
            specifications=product.specifications,
            slug=product.slug,
            price=float(product.price),
            avatarUrl=avatar_url,
            productImageUrls=product_image_urls
        )

    def getBestSellerProducts(self , page:int = 0,size:int =5)->List[ProductPreviewVm]:
        bestSellerProductIds = (
            self.db.query(OrderItem.product_id)
            .group_by(OrderItem.product_id)
            .order_by(desc(func.sum(OrderItem.quantity)))
            .offset(page*size)
            .limit(size)
            .all()
        )

        return self.getProductsByIds( [row[0] for row in bestSellerProductIds])




    def getProductByMultiParams(
        self,
        pageIndex: int,
        pageSize: int,
        productName: str,
        categorySlug: str,
        startPrice: float | None,
        endPrice: float | None
    ) -> ProductPreviewPagingVm:
       

        query = (
            self.db.query(Product)
            .filter(
                Product.is_public == True
            )
        )

        if productName:
            query = query.filter(
                func.lower(Product.name).like(f"%{productName.strip().lower()}%")
            )

        if categorySlug:
            query = query.join(Product.product_categories).join(ProductCategory.category).filter(Category.slug == categorySlug.strip())

        if startPrice is not None:
            query = query.filter(Product.price >= startPrice)

        if endPrice is not None:
            query = query.filter(Product.price <= endPrice)

        total_elements = query.count()
        total_pages = (total_elements + pageSize - 1) // pageSize

        products = (
            query
            .order_by(Product.id.asc())
            .offset(pageIndex * pageSize)
            .limit(pageSize)
            .all()
        )

        content_payload = [
            ProductPreviewVm(
                id=p.id,
                name=p.name,
                slug=p.slug,
                price=p.price,
                avatarUrl=self.image_service.get_image_by_id(p.avatar_image_id).url
            )
            for p in products
        ]

        return ProductPreviewPagingVm(
            productPreviewsPayload=content_payload,
            pageIndex=pageIndex,
            pageSize=pageSize,
            totalElements=total_elements,
            totalPages=total_pages,
            isLast=(pageIndex + 1) >= total_pages
        )
        


        
    def getLatestProducts(self,count:int)->List[ProductPreviewVm]:
        if count <= 0:
            return []
        products = (
            self.db.query(Product)
            .filter(Product.is_public == True)
            .order_by(Product.created_at.desc())
            .limit(count)
            .all()
        )
        if not products:
            return []
        return [
            ProductPreviewVm(
                id=p.id,
                name=p.name,
                slug=p.slug,
                price=p.price,
                createdOn=p.created_at
            )
            for p in products
        ]
        
    
    def getDetailProductById(self,id:int)->ProductVm:
        # product:Product = self.db.query(Product).filter(Product.id == id).first()
        # if not product:
        #     raise HTTPException(status_code=404, detail=f"Product not found: {slug}")
        
        # avatar_url : str = self.image_service.get_image_by_id(product.avatar_image_id).url
        # image_ids = [ img.image_id for img in product.product_images]
        # product_image_urls = [self.image_service.get_image_by_id(image_id).url for image_id in image_ids]
        # author_name = product.author.name

        # categories =  [category.category.name for category in product.product_categories]
        # return ProductDetailVm(
        #     id=product.id,
        #     name=product.name,
        #     authorName=author_name,
        #     categories=categories,
        #     description=product.description,
        #     specifications=product.specifications,
        #     slug=product.slug,
        #     price=float(product.price),
        #     avatarUrl=avatar_url,
        #     productImageUrls=product_image_urls
        # )
        product: Product = (
            self.db.query(Product)
            .filter(Product.id == id)
            .first()
        )

        if not product:
            raise HTTPException(status_code=404, detail=f"Product not found: {id}")
        thumbnail = None
        if product.avatar_image_id:
            thumbnail = self.image_service.get_image_by_id(product.avatar_image_id)

        product_image_medias = []
        for img in product.product_images:
            image_vm = self.image_service.get_image_by_id(img.image_id)
            product_image_medias.append(
                ImagePreviewVm(id=image_vm.id, url=image_vm.url)
            )
        categories = []
        for pc in product.product_categories:
            cat = pc.category
            image_category = None

            if cat.image_id:
                image_vm = self.image_service.get_image_by_id(cat.image_id)
                image_category = ImagePreviewVm(
                    id=image_vm.id,
                    url=image_vm.url
                )

            categories.append(
                CategoryVm(
                    id=cat.id,
                    name=cat.name,
                    description=cat.description,
                    slug=cat.slug,
                    imageId=cat.image_id,
                    imageCategory=image_category
                )
            )

        return ProductVm(
            id=product.id,
            name=product.name,
            description=product.description,
            specification=product.specifications,
            price=float(product.price),
            isPublished=product.is_public,
            isFeatured=product.is_feature,
            brandId=product.author_id,  # nếu brand riêng thì đổi lại
            categories=categories,
            thumbnailMedia=ImagePreviewVm(
                id=thumbnail.id,
                url=thumbnail.url
            ) if thumbnail else None,
            productImageMedias=product_image_medias,
            avatarUrl=thumbnail.url if thumbnail else "",
            createdOn=product.created_at
        )

    



    def getProductsByCategory(
        self,
        pageNo: int,
        pageSize: int,
        categorySlug: str
    ) -> ProductListGetFromCategoryVm:

        query = (
            self.db.query(Product)
            .join(Product.product_categories)
            .join(ProductCategory.category)
            .filter(
                Category.slug == categorySlug,
                Product.is_public == True
            )
        )

        total_elements = query.count()
        total_pages = (total_elements + pageSize - 1) // pageSize

        products = (
            query
            .order_by(Product.id.asc())
            .offset(pageNo * pageSize)
            .limit(pageSize)
            .all()
        )

        product_content = [
            ProductPreviewVm(
                id=p.id,
                name=p.name,
                slug=p.slug,
                price=p.price,
                avatarUrl=self.image_service.get_image_by_id(
                    p.avatar_image_id
                ).url if p.avatar_image_id else None
            )
            for p in products
        ]

        return ProductListGetFromCategoryVm(
            productContent=product_content,
            pageNo=pageNo,
            pageSize=pageSize,
            totalElements=total_elements,
            totalPages=total_pages,
            isLast=(pageNo + 1) >= total_pages
        )
   

    def getProductsWithFilter(
        self,
        pageIndex: int,
        productName: str,
        brandName: str,
        pageSize: int = 5
    )->ProductPreviewPagingVm:
         
        query = (
            self.db.query(Product)
        )

        if productName:
            query = query.filter(
                func.lower(Product.name).like(f"%{productName.strip().lower()}%")
            )
        if brandName:
            query = (
                query
                .join(Product.author)
                .filter(func.lower(Author.name) == brandName.strip().lower())
            )
        total_elements = query.count()
        total_pages = (total_elements + pageSize - 1) // pageSize

        products : list[Product]= (
            query
            .order_by(Product.id.asc())
            .offset(pageIndex * pageSize)
            .limit(pageSize)
            .all()
        )
        payload = [
            ProductPreviewVm(
                id=p.id,
                name=p.name,
                slug=p.slug,
                price=p.price,
                avatarUrl=self.image_service.get_image_by_id(
                    p.avatar_image_id
                ).url if p.avatar_image_id else None,
                isFeatured=p.is_feature,
                isPublished=p.is_public,
                createdOn=p.created_at
            )
            for p in products
        ]

        return ProductPreviewPagingVm(
            productPreviewsPayload=payload,
            pageIndex=pageIndex,
            pageSize=pageSize,
            totalElements=total_elements,
            totalPages=total_pages,
            isLast=(pageIndex + 1) >= total_pages
        )

            
    def deleteProductById(self,id:int):
        product: Product = self.db.query(Product).filter(Product.id == id).first()

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")


        try:
            product.product_categories.clear()
            product.product_images.clear()

            self.db.delete(product)
            self.db.commit()
        except IntegrityError as e:
            self.db.rollback()
            raise HTTPException(
                status_code=400,
                detail="Delete failed due to constraint"
            )



    def createProduct(self,productPostVm:ProductPostVm):

        existing_name = self.db.query(Product).filter(Product.name == productPostVm.name).first()
        if existing_name:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A product with this name already exists"
            )

        if productPostVm.slug:
            existing_slug = self.db.query(Product).filter(Product.slug == productPostVm.slug).first()
            if existing_slug:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="A product with this slug already exists"
                )
        product = Product()
        product.name = productPostVm.name
        product.description = productPostVm.description
        product.specifications = productPostVm.specification
        product.slug = productPostVm.slug
        product.price = Decimal(str(productPostVm.price))
        product.is_feature = productPostVm.isFeatured
        product.avatar_image_id = productPostVm.thumbnailMediaId
        product.author_id = productPostVm.brandId
        if productPostVm.categoryIds:
            for category_id in productPostVm.categoryIds:
                product_category = ProductCategory(category_id=category_id)
                product.product_categories.append(product_category)

        if productPostVm.productImageIds:
            for image_id in productPostVm.productImageIds:
                product_image = ProductImage(image_id=image_id)
                product.product_images.append(product_image)

        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)

    
def productService(db: Session):
    image_service = ImageService(db)
    return ProductService(db,image_service)
