from schemas.author_schema import *
from service.authorService import *
from fastapi import *


router = APIRouter()

@router.get("/api/backoffice/authors",response_model=List[AuthorVm])
def getAuthor(author_service:AuthorService = Depends(authorService)):
    return author_service.getAuthor()



@router.get("/api/backoffice/authors/{id}",response_model=AuthorVm)
def getAuthorById(
    id:int = Path(...),
    author_service: AuthorService = Depends(authorService)
):
    return author_service.getAuthorById(id)


@router.put("/api/backoffice/authors/{id}",response_model=None)
def updateAuthorById(
    authorPostVm:AuthorPostVm,
    id:int = Path(...),
    author_service: AuthorService = Depends(authorService),
):
    return author_service.updateAuthorById(id=id,authorPostVm=authorPostVm)