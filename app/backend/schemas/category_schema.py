from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from pydantic import BaseModel
from schemas.image_schema import ImagePreviewVm

class CategoryVm(BaseModel):
    id: int
    name: str
    slug: Optional[str]
    imageCategory: Optional[ImagePreviewVm]