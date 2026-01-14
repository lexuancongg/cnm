import {PaymentProvider} from "@/models/payment/PaymentProvider";
import apiClient from "@/utils/api/apiClient";

class PaymentProviderService{
    private  baseUrl:string ;
    constructor() {
        this.baseUrl = '/api'
    }

    public async getPaymentProviderEnable():Promise<PaymentProvider[]>{
        const response = await apiClient.get('/api');
        if(response.ok){
            return await response.json();
        }
        return  [
            {
                id:1,
                name:"PAYPAL",
                configureUrl:"",
                additionalSettings:""
            }
        ]

}


}
export default new PaymentProviderService();