from typing import List, Optional
from pydantic import BaseModel
from models.author import Author
from datetime import datetime
class AuthorVm(BaseModel):
    id:int
    name:str

    @staticmethod
    def from_model(author:Author)->"AuthorVm":
        return AuthorVm(
            id=author.id,
            name=author.name
        )


