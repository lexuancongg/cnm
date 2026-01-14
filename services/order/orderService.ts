import {OrderStatus} from "@/models/order/OrderStatus";
import {OrderVm} from "@/models/order/OrderVm";
import apiClient from "@/utils/api/apiClient";
import {CheckoutVm} from "@/models/order/checkout/CheckoutVm";
import {checkoutData} from "@/demo_data/order/checkout_demo_data";
import {OrderPostVm} from "@/models/order/OrderPostVm";

class OrderService {
    private baseUrl : string;
    constructor() {
        this.baseUrl = `http://localhost:8000/customer/orders`
    }

    public async  createOrder(orderPostVm:OrderPostVm){
        const response = await  apiClient.post(this.baseUrl , JSON.stringify(orderPostVm))
        if(response.ok){
            return
        }
        throw  response;



}

    public async getOrderAtStatus(status:OrderStatus|null):Promise<OrderVm[]>{
        const url = status ?
            `${this.baseUrl}/my-orders?orderStatus=${status}` :  // encode cho an toàn nếu status có ký tự đặc biệt
            `${this.baseUrl}/my-orders`;
        const response = await apiClient.get(url)
        if(response.ok){
            return  await response.json();
        }
        throw response;
    }






}
export default new OrderService();