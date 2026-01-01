from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from pydantic import BaseModel
from decimal import Decimal


class ProductPreviewVm(BaseModel):
    id: int
    name: str
    slug: str
    price: float
    avatarUrl: Optional[str]




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
    description:str
    specifications:str
    slug:str
    price:float
    avatarUrl:str
    productImageUrls:List[str]

