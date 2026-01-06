from schemas.author_schema import *
from service.authorService import *
from fastapi import *


router = APIRouter()

@router.get("/api/backoffice/authors",response_model=List[AuthorVm])
def getAuthor(author_service:AuthorService = Depends(authorService)):
    return author_service.getAuthor()

