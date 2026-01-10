from typing import List,Optional
from pydantic import BaseModel,Field
from datetime import datetime
from models.feedback import Feedback
class FeedbackVm(BaseModel):
    id: int
    content: str
    star: int
    firstName: str
    lastName: str
    productId: int
    createAt: datetime
    productName:Optional[str] = None


    @classmethod
    def from_model(cls, feedback:Feedback):
        return cls(
            id=feedback.id,
            content=feedback.content,
            star=feedback.star,
            firstName=feedback.first_name,
            lastName=feedback.last_name,
            productId=feedback.product_id,
            createAt=feedback.created_at,
            productName = feedback.product_name

        )

class FeedbackPagingVm(BaseModel):
    ratingPayload: List[FeedbackVm]
    pageIndex: int
    pageSize: int
    totalElements: int
    totalPages: int
    isLast: bool



class FeedbackPostVm(BaseModel):
    content: str
    star: int = Field(..., ge=1, le=5)
    productId: int
    productName:str




class RatingVm(BaseModel):
    id: int
    content: str
    star: int
    productId: int
    createdOn: datetime
    lastName: str
    firstName: str
    productName: str




class RatingPagingVm(BaseModel):
    ratingList:list[RatingVm]
    totalPages:int 