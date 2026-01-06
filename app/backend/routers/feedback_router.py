
from service.feedbackService import *
from schemas.feedback_schema import *
from helper.extractCustomerId  import extractCustomerId
from fastapi import *
router = APIRouter()

@router.get("/customer/feedbacks/{product_id}/average-star",response_model=float)
def average_star(
    product_id:int ,
    feedback_service:FeedBackService = Depends(feedbackService)

):
    return feedback_service.get_average_star(product_id=product_id)



@router.get("/customer/feedbacks/{productId}", response_model=FeedbackPagingVm)
def get_rating_by_product_id(
    productId: int,
    pageIndex: int = Query(0, alias="pageIndex"),
    pageSize: int = Query(10, alias="pageSize"),
    feedback_service:FeedBackService = Depends(feedbackService)
):
    return feedback_service.get_rating_by_product_id(pageIndex=pageIndex ,pageSize=pageSize,productId=productId)



@router.post("/customer/feedbacks")
def createFeedback(
    request:Request,
    feedbackPostVm:FeedbackPostVm,
    customerId : str = Depends(extractCustomerId),
    feedback_service:FeedBackService = Depends(feedbackService)
):
    feedback_service.createFeedback(customerId=customerId,feedbackPostVm=feedbackPostVm,request=request)




# admin
@router.get("/api/rating/backoffice/ratings/latest/{count}", response_model=List[FeedbackVm])
def get_latest_ratings(
    count: int = Path(..., ge=1),
    db: Session = Depends(get_db),
    feedback_service:FeedBackService = Depends(feedbackService)
):
    return feedback_service.get_latest_ratings(count=count)
