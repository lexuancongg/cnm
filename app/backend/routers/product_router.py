from schemas.product_schema import *
from db.session import get_db
from service.productService import *

from fastapi import *


router = APIRouter()

@router.get("/api/product/customer/products/featured", response_model=ProductPreviewPagingVm)
def get_featured_products_paging(
    pageIndex: int = Query(0),
    pageSize: int = Query(10),
    db: Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.get_featured_products_paging(pageIndex, pageSize)






@router.get("/api/product/customer/products/best-seller", response_model=List[ProductPreviewVm])
def getBestSellerProducts(
    db:Session = Depends(get_db)
):  
    
    product_service = productService(db)
    return product_service.getBestSellerProducts()


@router.get("/api/product/customer/products/filter",response_model=ProductPreviewPagingVm)
def get_product_by_multi_params(
    pageIndex: int = Query(0),
    pageSize: int = Query(10),
    productName: str = Query(""),
    categorySlug: str = Query(""),
    startPrice: Optional[float] = Query(None),
    endPrice: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getProductByMultiParams(
        pageIndex,
        pageSize,
        productName,
        categorySlug,
        startPrice,
        endPrice
    )

@router.get("/api/product/customer/products/{slug}", response_model=ProductDetailVm)
async def get_product_detail(
    slug: str = Path(..., description="product slug"),
    db: Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getProductDetailBySlug(slug)



# admin

@router.get("/api/product/backoffice/products/latest/{count}",response_model=List[ProductPreviewVm])
def getLatestProducts(
    count: int = Path(..., ge=1),

    db:Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getLatestProducts(count=5)


    

@router.get("/api/product/backoffice/products/{id}",response_model=ProductDetailVm)
def getProductById(
    id:int = Path(...),
    db:Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getDetailProductById(id=id)
    

