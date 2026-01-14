'use client';

import {OrderVm} from "@/models/order/OrderVm";
import {OrderStatus} from "@/models/order/OrderStatus";
import {PaymentMethod} from "@/models/payment/PaymentMethod";

import dayjs from "dayjs";
import Link from "next/link";
import {useMemo, useState} from "react";

interface Props {
    order: OrderVm;
}

const getStatusColor = (status: OrderStatus) => {
    const colors: { [key: string]: { bg: string; text: string } } = {
        PENDING: {bg: 'bg-yellow-100', text: 'text-yellow-800'},
        CONFIRMED: {bg: 'bg-blue-100', text: 'text-blue-800'},
        PROCESSING: {bg: 'bg-indigo-100', text: 'text-indigo-800'},
        CANCELLED: {bg: 'bg-red-100', text: 'text-red-800'},
        COMPLETED: {bg: 'bg-emerald-100', text: 'text-emerald-800'},
    };
    return colors[status] || {bg: 'bg-gray-100', text: 'text-gray-800'};
};

const PaymentIcon = ({method}: { method: PaymentMethod | null }) => {
    if (!method) {
        return (
            <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">{method}</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-1">
            {method === PaymentMethod.PAYPAL && (
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M7 4c0 .553-.103 1-.307 1H6V4c0-.553.448-.997 1-1h5.5c.552 0 1 .449 1 1v2.5c0 .553-.448.997-1 1H9.307C9.103 6 9 6.447 9 7v2.75c0 .553.103 1 .307 1H12v-2a1 1 0 011-1h.646A1 1 0 0115 8.5V5c0-1.105-.89-2-1.995-2H8c-1.103 0-2 .895-2 2v1zM7 9a1 1 0 01-1-1V4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1H7z"/>
                    <path
                        d="M3 13.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM8.5 12a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z"/>
                </svg>
            )}
            <span className="text-xs text-gray-600 capitalize">{method.toLowerCase()}</span>
        </div>
    );
};


export default function OrderCard({order}: Props) {

    const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')} đ`;
    const orderDate = dayjs(order.createdAt).format('DD/MM/YYYY HH:mm');
    const [showAllItems, setShowAllItems] = useState(false);
    const itemsToShow = showAllItems
        ? order.orderItemVms
        : order.orderItemVms.slice(0, 1);

    const addressSummary = useMemo(() => {
        const addr = order.shippingAddressVm;

        const contactName = addr.contactName;
        const districtName = addr.districtName;
        const provinceName = addr.provinceName;
        return `${contactName}, ${addr.specificAddress}, ${districtName}, ${provinceName}`;
    }, [order.shippingAddressVm]);

    return (
        <div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p className="text-sm font-medium text-gray-700">{orderDate}</p>
                    </div>
                    <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus).bg} ${getStatusColor(order.orderStatus).text}`}>
                        {order.orderStatus.replace('_', ' ')}
                    </span>
                </div>

                {order.shippingAddressVm && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-2 mb-2">
                            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <p className="text-xs text-gray-500 truncate" title={addressSummary}>
                                {addressSummary}
                            </p>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.684l1.498 4.493a1 1 0 01-.502 1.21l-1.272.636a11.042 11.042 0 005.516 5.516l.636-1.272a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.95V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                            </svg>
                            {order.shippingAddressVm.phoneNumber}
                        </p>

                    </div>
                )}
            </div>

            <div className="p-5 divide-y divide-gray-100">
                <p className="text-xs text-gray-500 mb-3 pt-1">
                    {order.numberItem} item{order.numberItem > 1 ? 's' : ''}
                </p>
                {itemsToShow.map((item: any) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                            src={item.productAvatarUrl || "https://via.placeholder.com/64x64?text=Product"}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/product/${item.productId}`}
                                className="block text-sm font-semibold text-gray-900 hover:text-blue-600 truncate mb-1"
                                title={item.productName}
                            >
                                {item.productName}
                            </Link>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × {formatPrice(item.productPrice)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{formatPrice(item.totalPrice)}</p>
                        </div>
                    </div>
                ))}
                {order.orderItemVms.length > 1 && (
                    <button
                        onClick={() => setShowAllItems(!showAllItems)}
                        className="text-sm text-blue-600 hover:underline pt-3"
                    >
                        {showAllItems
                            ? 'Thu gọn'
                            : `Xem thêm ${order.orderItemVms.length - 1} sản phẩm`}
                    </button>
                )}
                {order.note && (
                    <div className="pt-3">
                        <p className="text-xs text-gray-500 italic px-2 py-2 bg-yellow-50 rounded border border-yellow-200">
                            Note: {order.note}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                    <PaymentIcon method={order.paymentMethod}/>
                    <span className="text-sm font-semibold text-gray-900">Total: {formatPrice(order.totalPrice)}</span>
                </div>
                {order.orderStatus == OrderStatus.PENDING &&
                    <button
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                    >
                        Cancel

                    </button>}
            </div>
        </div>
    );
}

