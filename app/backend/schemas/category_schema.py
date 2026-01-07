from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from pydantic import BaseModel,Field
from schemas.image_schema import ImagePreviewVm

class CategoryVm(BaseModel):
    id: int
    name: str
    slug: Optional[str]
    imageId:Optional[int]=None
    imageCategory: Optional[ImagePreviewVm]
    description:Optional[str] = None


class CategoryPostVm(BaseModel):
    name: str = Field(..., min_length=1)
    slug: str = Field(..., min_length=1)
    description: Optional[str] = None
    imageId: Optional[int] = None