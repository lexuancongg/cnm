from fastapi import *

from service.categoryService import *
from db.session import get_db

router = APIRouter()

@router.get("/api/customer/categories", response_model=List[CategoryVm])
def api_get_categories(category_name: str = Query("", alias="categoryName"), db: Session = Depends(get_db)):
    service = categoryService(db)
    return service.get_categories(category_name)



#admin 
@router.get("/api/backoffice/categories",response_model=List[CategoryVm])
def getCategories(
    db:Session = Depends(get_db)
):
    service = categoryService(db)
    return service.get_categories(category_name="")
    