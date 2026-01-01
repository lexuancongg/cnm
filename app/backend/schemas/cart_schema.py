from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from pydantic import BaseModel, Field
from schemas.image_schema import ImagePreviewVm

class CartItemPostVm(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., ge=1)


class CartItemGetVm(BaseModel):
    customer_id: str
    product_id: int
    quantity: int

class CartItemDetailVm(BaseModel):
    product_id: int
    quantity: int
    product_name: str
    slug: str
    avatarUrl: str
    price: float



class CartItemPostVm(BaseModel):
    quantity : int
    productId :int
