from pydantic import BaseModel
from typing import Optional

class TaskSchema(BaseModel):
    id: int
    title: str
    description: str
    status: int

    class Config:
        from_attributes = True

class TaskSchemaCreate(BaseModel):
    title: str
    description: str
    status: int

class TaskSchemaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[int] = None
