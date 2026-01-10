from sqlalchemy.orm import Session
from db.session import get_db
from sqlalchemy import func
from models.feedback import Feedback
from fastapi import *
from schemas.feedback_schema import *
from sqlalchemy import desc
from math import ceil
from service.customerService import *
from service.orderService import *
from schemas.customer_schema import CustomerVm

class FeedBackService:
    def __init__(self,db:Session,customer_service:CustomerService,order_service:OrderService):
        self.db = db
        self.customer_service = customer_service
        self.order_service = order_service

    def get_average_star(self, product_id: int) -> float:
        avg_star = self.db.query(func.avg(Feedback.star)).filter(Feedback.product_id == product_id) .scalar()
        return float(avg_star or 0) 
    

    def get_rating_by_product_id(self,productId: int, pageIndex: int, pageSize: int) -> FeedbackPagingVm:
        total_elements = self.db.query(Feedback).filter(Feedback.product_id == productId).count()

        feedbacks = (
            self.db.query(Feedback)
            .filter(Feedback.product_id == productId)
            .order_by(desc(Feedback.created_at))
            .offset(pageIndex * pageSize)
            .limit(pageSize)
            .all()
        )

        feedback_vms = [FeedbackVm.from_model(fb) for fb in feedbacks]

        total_pages = ceil(total_elements / pageSize)
        is_last = pageIndex >= total_pages - 1

        return FeedbackPagingVm(
            ratingPayload=feedback_vms,
            pageIndex=pageIndex,
            pageSize=pageSize,
            totalElements=total_elements,
            totalPages=total_pages,
            isLast=is_last
        )
    


    def createFeedback(self,customerId:str,feedbackPostVm:FeedbackPostVm,request:Request):
        existed_rating = (
            self.db.query(Feedback)
            .filter(Feedback.created_by == customerId,Feedback.product_id == feedbackPostVm.productId)
            .first()
        
        )
        if existed_rating:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="FEEDBACK_EXITED"
            )
        
        if not self.check_user_has_bought_product_completed(productId=feedbackPostVm.productId,customerId=customerId):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="ACCESS_DENIED"
            )

        customer_vm :CustomerVm = self.customer_service.get_customer_profile(request=request)
        if not customer_vm:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="CUSTOMER_NOT_FOUND"
            )
        feedback = Feedback(
            product_id=feedbackPostVm.productId,
            content=feedbackPostVm.content,
            star=feedbackPostVm.star,
            first_name=customer_vm.firstName,
            last_name=customer_vm.lastName,
            created_by=customerId,
            product_name = feedbackPostVm.productName
        )

        self.db.add(feedback)
        self.db.commit()
        self.db.refresh(feedback)

        return FeedbackVm.from_model(feedback)
    

    def check_user_has_bought_product_completed(self,productId:int,customerId:str)->bool:
        return self.order_service.checkUserHasBoughtProductCompleted(customerId=customerId,productId=productId).hasPurchased
        
        

    def get_latest_ratings(self, count: int) -> List[FeedbackVm]:
        if count <= 0:
            return []

        ratings = (
            self.db.query(Feedback)
            .order_by(Feedback.created_at.desc())
            .limit(count)
            .all()
        )

        if not ratings:
            return []

        return [FeedbackVm.from_model(r) for r in ratings]



    def getRatings(
        self,
        pageNo: int,
        pageSize: int,
        productName: str
    ) -> RatingPagingVm:

        query = self.db.query(Feedback)

        if productName:
            query = query.filter(
                Feedback.product_name.ilike(f"%{productName}%")
            )

        total = query.count()
        totalPages = ceil(total / pageSize) if pageSize else 0

        feedbacks = (
            query
            .order_by(Feedback.created_at.desc())
            .offset(pageNo * pageSize)
            .limit(pageSize)
            .all()
        )

        ratingList = [
            RatingVm(
                id=fb.id,
                content=fb.content,
                star=fb.star,
                productId=fb.product_id,
                createdOn=fb.created_at,
                lastName=fb.last_name,
                firstName=fb.first_name,
                productName=fb.product_name
            )
            for fb in feedbacks
        ]

        return RatingPagingVm(
            ratingList=ratingList,
            totalPages=totalPages
        )

    def deleteRating(self, id: int):
        rating = (
            self.db.query(Feedback)
            .filter(Feedback.id == id)
            .first()
        )

        if not rating:
            raise HTTPException(
                status_code=404,
                detail="Rating not found"
            )

        self.db.delete(rating)
        self.db.commit()



def feedbackService(db:Session = Depends(get_db), customer_service = Depends(customerService) ,order_service = Depends(orderService) ):
    return FeedBackService(db=db,customer_service=customer_service,order_service=order_service)
