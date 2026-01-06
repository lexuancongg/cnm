from db.session import get_db
from sqlalchemy.orm import Session
from models.author import *
from schemas.author_schema import *
from fastapi import *
from sqlalchemy import and_


class AuthorService:
    def __init__(self,db:Session):
        self.db = db
    

    def getAuthor(self)->List[AuthorVm]:
        authors : list[Author] = (
            self.db.query(Author)
            .all()
        )

        return [AuthorVm.from_model(author) for author in authors]
        
    def  getAuthorById(self,id:int)->AuthorVm:
        author:Author = (
            self.db.query(Author)
            .filter(Author.id == id)
            .first()
        )
        return AuthorVm.from_model(author)


    def updateAuthorById(self, id: int, authorPostVm: AuthorPostVm) -> AuthorVm:
        author: Author = (
            self.db.query(Author)
            .filter(Author.id == id)
            .first()
        )

        if not author:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Author not found"
            )

        exist_author = (
            self.db.query(Author)
            .filter(
                and_(
                    Author.name == authorPostVm.name,
                    Author.id != id
                )
            )
            .first()
        )

        if exist_author:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Author name already exists"
            )

        author.name = authorPostVm.name

        self.db.commit()
        self.db.refresh(author)





def authorService(db:Session = Depends(get_db))->AuthorService:
    return AuthorService(db)

    