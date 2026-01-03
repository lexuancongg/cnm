from pydantic import BaseModel
from typing import Optional


class InitPaymentRequest(BaseModel):
    paymentMethod: str
    totalPrice: float
    orderId: int




class InitPaymentResponse(BaseModel):
    status: str
    paymentId: str
    redirectUrl: str



class CapturePaymentRequestVm(BaseModel):
    paymentMethod: str
    token: str




class CapturePaymentResponseVm(BaseModel):
    orderId: Optional[int] = None
    checkoutId: Optional[str] = None
    amount: Optional[float] = None
    paymentFee: Optional[float] = None
    gatewayTransactionId: Optional[str] = None
    paymentMethod: Optional[str] = None
    paymentStatus: Optional[str] = None
    failureMessage: Optional[str] = None
