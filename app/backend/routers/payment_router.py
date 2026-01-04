from fastapi import *

from schemas.payment_schema import *
from service.paypalPayment_service import *
router = APIRouter()



@router.post("/init",response_model=InitPaymentResponse)
def initPayment(
    initPaymentRequest: InitPaymentRequest,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.create_payment(initPaymentRequest)





@router.post("/capture",response_model=CapturePaymentResponseVm)
def capturePaypalPayment(
    capturePaymentRequest:CapturePaymentRequestVm,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.capturePaymentPaypal(capturePaymentRequest= capturePaymentRequest)
