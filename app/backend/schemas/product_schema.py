from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


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