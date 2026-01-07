from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import Form, File, UploadFile
from db.session import SessionLocal
from pydantic import BaseModel


class ImagePreviewVm(BaseModel):
    id: int
    url: str



class ImageDetailVm(BaseModel):
    id: int
    description: Optional[str]
    fileName: str
    imageType: str
    url: str


class MediaPostVm(BaseModel):
    caption: Optional[str] = Form(None)
    multipartFile: UploadFile = File(...)
    fileNameOverride: Optional[str] = Form(None)


class NoFileMediaVm(BaseModel):
    id: int
    caption: Optional[str]
    fileName: str
    mediaType: str

    class Config:
        from_attributes = True