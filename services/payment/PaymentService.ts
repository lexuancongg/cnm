import {InitPaymentPaypalRequest} from "@/models/payment/paypal/InitPaymentPaypalRequest";
import {InitPaymentPaypalResponse} from "@/models/payment/paypal/InitPaymentPaypalResponse";
import apiClient from "@/utils/api/apiClient";
import {CapturePaymentRequest} from "@/models/payment/paypal/CapturePaypalRequest";
import {CapturePaypalResponse} from "@/models/payment/paypal/CapturePaypalResponse";

class PaymentService{
    private  baseUrl:string ;
    constructor() {
        this.baseUrl = `http://localhost:8000`
    }

    public async initPaymentPaypal( paymentPaypalRequest: InitPaymentPaypalRequest):Promise<InitPaymentPaypalResponse>{
        const res = await apiClient.post(`${this.baseUrl}/init`, JSON.stringify(paymentPaypalRequest));
        if (res.ok) {
            return res.json();
        }
        throw res;

    }

    public async capturePaymentPaypal(capturePaypalRequest:CapturePaymentRequest):Promise<CapturePaypalResponse>{
        const response = await apiClient.post(`${this.baseUrl}/capture`,JSON.stringify(capturePaypalRequest));
        if(response.ok){
            return  await  response.json();
        }
        throw  response;
    }


}
export default new PaymentService();