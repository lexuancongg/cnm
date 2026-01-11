from fastapi import *
from mid.admin_mid import checkRoleAdmin
from mid.auth_mid import auth_mid
from schemas.payment_schema import *
from service.paypalPayment_service import *
router = APIRouter()



@router.post("/init",response_model=InitPaymentResponse,dependencies=[Depends(auth_mid)])
def initPayment(
    initPaymentRequest: InitPaymentRequest,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.create_payment(initPaymentRequest)





@router.post("/capture",response_model=CapturePaymentResponseVm,dependencies=[Depends(auth_mid)])
def capturePaypalPayment(
    capturePaymentRequest:CapturePaymentRequestVm,
    paypay_payment_service  : PaypalPaymentService= Depends(paypalPaymentService)
):
    return paypay_payment_service.capturePaymentPaypal(capturePaymentRequest= capturePaymentRequest)
