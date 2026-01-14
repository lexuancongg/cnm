import {CheckoutVm} from "@/models/order/checkout/CheckoutVm";
import apiClient from "@/utils/api/apiClient";
import {CheckoutPostVm} from "@/models/order/checkout/CheckoutPostVm";


class CheckoutService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `http://localhost:8000`
    }

    public async createCheckout(checkoutPostVm: CheckoutPostVm): Promise<CheckoutVm> {
        const response = await apiClient.post(`${this.baseUrl}/customer/checkouts`, JSON.stringify(checkoutPostVm))
        if (response.ok) {
            return await response.json();
        }
        throw response;

    }

    public async getCheckoutById(checkoutId:number):Promise<CheckoutVm>{
        const response = await apiClient.get(`${this.baseUrl}/customer/checkouts/${checkoutId}`);
        if(response.ok) {
            return await response.json();
        }
        throw response;
    }
}
export default  new CheckoutService();