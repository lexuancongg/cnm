from schemas.payment_schema import *
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment

from decimal import Decimal



USD_RATE = 24500
class PaypalPaymentService:
    def __init__(self, client_id: str, client_secret: str, return_url: str, cancel_url: str):
        environment = SandboxEnvironment(client_id=client_id, client_secret=client_secret)
        self.client = PayPalHttpClient(environment)
        self.return_url = return_url
        self.cancel_url = cancel_url
        self.brand_name = "lexuancong"
        self.max_pay = 1000000

    def create_payment(self, paypal_create_request: InitPaymentRequest) -> InitPaymentResponse:
        total_price = paypal_create_request.totalPrice
        if total_price <= 0:
            return InitPaymentResponse(
                status="BAD_REQUEST",
                paymentId=str(paypal_create_request.orderId),
                redirectUrl=None
            )

        amount_to_pay = round(total_price / USD_RATE, 2)  

        # Build request body
        request_body = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "USD",
                    "value": str(amount_to_pay)
                }
            }],
            "application_context": {
                "return_url": f"{self.return_url}?paymentMethod={paypal_create_request.paymentMethod}",
                "cancel_url": self.cancel_url,
                "brand_name": self.brand_name,
                "landing_page": "BILLING",
                "user_action": "PAY_NOW",
                "shipping_preference": "NO_SHIPPING"
            }
        }

        request = OrdersCreateRequest()
        request.prefer("return=representation")
        request.request_body(request_body)

        try:
            response = self.client.execute(request)
            order = response.result

            redirect_url = next((link.href for link in order.links if link.rel == "approve"), None)
            if redirect_url is None:
                raise ValueError("Approve link not found")

            return InitPaymentResponse(
                status="OK",
                paymentId=order.id,
                redirectUrl=redirect_url
            )

        except Exception as e:
            return InitPaymentResponse(
                status="INTERNAL_SERVER_ERROR",
                paymentId=str(paypal_create_request.orderId),
                redirectUrl=""
            )
        



    def capturePaymentPaypal(
        self,
        capturePaymentRequest: CapturePaymentRequestVm
    ) -> CapturePaymentResponseVm:

        request = OrdersCaptureRequest(capturePaymentRequest.token)

        try:
            response = self.client.execute(request)
            order = response.result

            if order.status:
                capture = (
                    order.purchase_units[0]
                    .payments.captures[0]
                )

                paypal_fee = Decimal(
                    capture.seller_receivable_breakdown.paypal_fee.value
                )
                amount = Decimal(capture.amount.value)

                return CapturePaymentResponseVm(
                    paymentFee=float(paypal_fee),
                    gatewayTransactionId=order.id,
                    amount=float(amount),
                    paymentStatus=order.status,
                    paymentMethod="PAYPAL"
                )

        except Exception as e:
            return CapturePaymentResponseVm(
                failureMessage=str(e)
            )

        return CapturePaymentResponseVm(
            failureMessage="Something Wrong!"
        )



def paypalPaymentService()->PaypalPaymentService:
    return PaypalPaymentService(
        cancel_url="http://localhost:3000/complete-payment/cancel",
        client_id="AVHztUcMo3AlwQnkfGrg0COwKOuO96LL-yto849VgKC4eR0JaU8H6dff1yDQn0UH_I4lYEsA0Bj51m2F",
        client_secret="EE7lvp1xSlnu9DAZu8MW3pxiJCqb4uSAYpTqKcNTe2pDRctvhDXVncpgWK5rNBPDrx3NkeTF6X6Ek7wD",
        return_url="http://localhost:3000/complete-payment/capture"
    )