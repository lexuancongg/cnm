'use client';
import { OrderStatus } from "@/models/order/OrderStatus";
import { useEffect, useState } from "react";
import { OrderVm } from "@/models/order/OrderVm";
import orderService from "@/services/order/orderService";
import { ProductPreviewVm } from "@/models/product/ProductPreviewVm";
import productService from "@/services/product/productService";
import { DeliveryStatus } from "@/models/order/DeliveryStatus";
import dayjs from "dayjs";
import { DeliveryMethod } from "@/models/order/DeliveryMethod";
import OrderCard from "./orderCard";

type Props = {
    orderStatus: OrderStatus | null;
};

export default function OrderStatusTab({ orderStatus }: Props) {
    const [orders, setOrders] = useState<OrderVm[]>([]);

    useEffect(() => {
        orderService.getOrderAtStatus(orderStatus)
            .then(res => {
                setOrders(res)
            })
            .catch((error)=>{
                console.log(error)
            })
    }, [orderStatus]);

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">  {/* Thay đổi: Thêm bg trắng + shadow + border để nổi bật, không lẫn với nền */}
                <div className="text-gray-500 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">No Orders</h3>
                <p className="text-gray-600">Chưa có đơn hàng nào ở trạng thái này.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
    );
}