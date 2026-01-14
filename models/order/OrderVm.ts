import {OrderStatus} from "@/models/order/OrderStatus";
import dayjs, {Dayjs} from "dayjs";
import {DeliveryStatus} from "@/models/order/DeliveryStatus";
import {DeliveryMethod} from "@/models/order/DeliveryMethod";
import {OrderItemVm} from "@/models/order/OrderItemVm";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import {PaymentMethod} from "@/models/payment/PaymentMethod";

export interface OrderVm {
    id:number;
    email:string;
    shippingAddressVm:AddressDetailVm
    note:string;
    numberItem:number;
    orderStatus:OrderStatus;
    totalPrice: number;
    orderItemVms: OrderItemVm[];
    createdAt: Dayjs;
    paymentMethod:PaymentMethod


}