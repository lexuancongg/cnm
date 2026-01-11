from schemas.product_schema import *
from db.session import get_db
from service.productService import *
from mid.admin_mid import checkRoleAdmin
from mid.auth_mid import auth_mid

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

@router.get("/api/product/backoffice/products/latest/{count}",response_model=List[ProductPreviewVm],dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getLatestProducts(
    count: int = Path(..., ge=1),

    db:Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getLatestProducts(count=5)


    

@router.get("/api/product/backoffice/products/{id}",response_model=ProductVm,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getProductById(
    id:int = Path(...),
    db:Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getDetailProductById(id=id)
    

@router.get("/api/product/backoffice/category/{categorySlug}/products",response_model=ProductListGetFromCategoryVm,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def getProductsByCategory(
    categorySlug:str = Path(...),
    pageNo: int = Query(0),
    pageSize: int = Query(2),
    db:Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getProductsByCategory(categorySlug=categorySlug,pageNo=pageNo,pageSize=pageSize)
    
    



@router.get("/api/product/backoffice/products", response_model=ProductPreviewPagingVm,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def get_products(
    pageNo: int = Query(0),
    product_name: str = Query("", alias="product-name"),
    brand_name: str = Query("", alias="brand-name"),
    db: Session = Depends(get_db)
):
    product_service = productService(db)
    return product_service.getProductsWithFilter(brandName=brand_name,productName=product_name,pageIndex=pageNo)

    


@router.delete("/api/product/backoffice/products/{id}",dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def deleteProduct(
    id:int =Path(...),
    db:Session= Depends(get_db)
):
    product_service = productService(db)
    return product_service.deleteProductById(id)




@router.post("/api/product/backoffice/products",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def createProductc(
    productPostVm:ProductPostVm,
    db:Session = Depends(get_db)
):
    product_service= productService(db)
    return product_service.createProduct(productPostVm=productPostVm)


@router.put("/api/product/backoffice/products/{id}",response_model=None,dependencies=[Depends(auth_mid),Depends(checkRoleAdmin)])
def updateProduct(
    productPostVm:ProductPostVm,
    id:int = Path(...),
   
    db:Session = Depends(get_db)
):
    product_service= productService(db)
    return product_service.updateProduct(id=id,productPostVm=productPostVm)
    
