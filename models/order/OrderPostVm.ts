import {DeliveryMethod} from "@/models/order/DeliveryMethod";
import {OrderItemPostVm} from "@/models/order/OrderItemPostVm";
import {AddressPostVm} from "@/models/address/AddressPostVm";

export type OrderPostVm = {
    email?:string,
    note:string,
    checkoutId:number,
    numberItem : number,
    totalPrice:number,
    deliveryMethod: DeliveryMethod;
    paymentMethod: string;
    paymentStatus: string;
    orderItemPostVms:OrderItemPostVm[],
    shippingAddress:AddressPostVm
}