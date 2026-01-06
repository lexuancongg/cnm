from db.session import get_db
from sqlalchemy.orm import Session
from models.author import *
from schemas.author_schema import *
from fastapi import *


class AuthorService:
    def __init__(self,db:Session):
        self.db = db
    

    def getAuthor(self)->List[AuthorVm]:
        authors : list[Author] = (
            self.db.query(Author)
            .all()
        )

        return [AuthorVm.from_model(author) for author in authors]
        




def authorService(db:Session = Depends(get_db))->AuthorService:
    return AuthorService(db)

    