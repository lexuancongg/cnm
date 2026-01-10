from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from schemas.category_schema import CategoryVm
from schemas.image_schema import ImagePreviewVm


class ProductPreviewVm(BaseModel):
    id: int
    name: str
    slug: str
    price: float
    avatarUrl: Optional[str] = None
    createdOn: Optional[datetime] = None
    isPublished:Optional[bool] = None
    isFeatured:Optional[bool]=None




class ProductPreviewPagingVm(BaseModel):
    productPreviewsPayload: List[ProductPreviewVm]
    pageIndex: int
    pageSize: int
    totalElements: int
    totalPages: int
    isLast: bool



class ProductDetailVm(BaseModel):
    id:int
    name:str
    authorName:str
    categories:List[str]
    description:Optional[str]
    specifications:Optional[str]
    slug:str
    price:float
    avatarUrl:str
    productImageUrls:List[str]



class ProductListGetFromCategoryVm(BaseModel):
    productContent:List[ProductPreviewVm]
    pageNo:int
    pageSize:int
    totalElements:int
    totalPages: int
    isLast:bool


class ProductPostVm(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    brandId: Optional[int] = None
    categoryIds: Optional[List[int]] = None
    description: Optional[str] = None
    specification: Optional[str] = None
    price: Optional[float] = None
    isPublished: Optional[bool] = None
    isFeatured: Optional[bool] = None
    thumbnailMediaId: Optional[int] = None
    productImageIds: Optional[List[int]] = None



class ProductVm(BaseModel):
    id: int
    name: str
    description: str
    specification: str
    price: float
    slug:str
    isPublished: bool
    isFeatured: bool
    brandId: int
    categories: List[CategoryVm]
    thumbnailMedia: ImagePreviewVm
    productImageMedias: List[ImagePreviewVm]
    avatarUrl: str
    createdOn: Optional[datetime] =None