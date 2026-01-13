import { OrderItem } from './OrderItem';
import { OrderAddress } from './OrderAddress';
export type Order = {
  id?: number;
  email: string;
  note?: string;
  numberItem: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: Date;
  orderStatus: string;
  orderItemVms: OrderItem[];
  shippingAddressVm: OrderAddress;
  checkoutId?: string;
};
