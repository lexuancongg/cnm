import {CheckoutItemPostVm} from "@/models/order/checkout/CheckoutItemPostVm";

export  type  CheckoutPostVm = {
    email: string,
    note: string,
    totalPrice : number,
    checkoutItemPostVms : CheckoutItemPostVm[]

}