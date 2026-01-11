
from mid.admin_mid import checkRoleAdmin
from mid.auth_mid import auth_mid
from service.categoryService import *
from schemas.category_schema import *
from db.session import get_db
from fastapi import *

router = APIRouter()

@router.get("/api/customer/categories", response_model=List[CategoryVm])
def api_get_categories(category_name: str = Query("", alias="categoryName"), db: Session = Depends(get_db)):
    service = categoryService(db)
    return service.get_categories(category_name)



#admin 
@router.get("/api/backoffice/categories",response_model=List[CategoryVm],dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getCategories(
    db:Session = Depends(get_db)
):
    service = categoryService(db)
    return service.get_categories(category_name="")



@router.post("/api/backoffice/categories",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def createCategory(
    categoryPostVm:CategoryPostVm,
    db:Session = Depends(get_db),
):
    service = categoryService(db)
    return service.createCategory(categoryPostVm=categoryPostVm)


@router.delete("/api/backoffice/categories/{id}",dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def deleteCategory(
    id:int = Path(...),
    db:Session = Depends(get_db)
):
    service = categoryService(db)
    return service.deleteCategory(id)


@router.get("/api/backoffice/categories/{id}",response_model=CategoryVm,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getCategoryById(
    id:int = Path(...),
    db:Session = Depends(get_db)
):
    service = categoryService(db)
    return service.getCategoryById(id)
    

@router.put("/api/backoffice/categories/{id}",dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def updateCategory(
    categoryPostVm:CategoryPostVm,
    id:int = Path(...),
    db:Session = Depends(get_db),
    
):
    service = categoryService(db)
    return service.updateCategory(id=id,categoryPostVm=categoryPostVm)