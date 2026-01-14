import {DeliveryMethod} from "@/models/order/DeliveryMethod";
import {DeliveryStatus} from "@/models/order/DeliveryStatus";
import {OrderItemVm} from "@/models/order/OrderItemVm";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";

export type OrderDetailVm = {
    id:number,
    email?:string,
    note:string,
    numberItem : number,
    totalPrice:number,
    deliveryMethod: DeliveryMethod;
    deliveryStatus: DeliveryStatus;
    paymentMethod: string;
    paymentStatus: string;
    orderItemVms:OrderItemVm[],
    shippingAddress:AddressDetailVm
}