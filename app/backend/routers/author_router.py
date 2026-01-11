from schemas.author_schema import *
from service.authorService import *
from mid.admin_mid import checkRoleAdmin
from mid.auth_mid import auth_mid
from fastapi import *


router = APIRouter()

@router.get("/api/backoffice/authors",response_model=List[AuthorVm],dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getAuthor(author_service:AuthorService = Depends(authorService)):
    return author_service.getAuthor()



@router.get("/api/backoffice/authors/{id}",response_model=AuthorVm,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getAuthorById(
    id:int = Path(...),
    author_service: AuthorService = Depends(authorService)
):
    return author_service.getAuthorById(id)


@router.put("/api/backoffice/authors/{id}",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def updateAuthorById(
    authorPostVm:AuthorPostVm,
    id:int = Path(...),
    author_service: AuthorService = Depends(authorService),
):
    return author_service.updateAuthorById(id=id,authorPostVm=authorPostVm)


@router.post("/api/backoffice/authors",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def createAuthor(
    authorPostVm:AuthorPostVm,
    author_service: AuthorService = Depends(authorService),
):
    return author_service.createAuthor(authorPostVm=authorPostVm)


@router.delete("/api/backoffice/authors/{id}",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def deleteAuthor(
    id:int = Path(...),
    author_service: AuthorService = Depends(authorService),
):
    return author_service.deleteAuthor(id)
