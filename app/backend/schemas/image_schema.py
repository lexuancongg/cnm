from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from db.session import SessionLocal
from pydantic import BaseModel


class ImagePreviewVm(BaseModel):
    id: int
    url: str
