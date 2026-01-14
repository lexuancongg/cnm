'use client';
import { NextPage } from "next";
import { OrderStatus } from "@/models/order/OrderStatus";
import OrderStatusTab from "@/components/order/orderStatusTab";
import React, { useState } from "react";

const MyOrders: NextPage = () => {
    const [activeTab, setActiveTab] = useState<OrderStatus | null>(null);
    const orderStatus: string[] = Object.keys(OrderStatus);

    const TabButton = ({ status, isActive }: { status: OrderStatus | null; isActive: boolean }) => (
        <button
            onClick={() => setActiveTab(status)}
            className={`
                px-4 py-3 text-sm font-semibold transition-all duration-200 whitespace-nowrap rounded-t-lg shadow-sm
                ${isActive
                ? 'text-red-700 bg-white border-b-4 border-red-500 shadow-md'  // Thay đổi: Active tab nổi bật hơn với bg trắng, border dày, shadow
                : 'text-gray-600 bg-gray-100 hover:text-gray-800 hover:bg-white hover:border-gray-300 border-b border-transparent'  // Thay đổi: Inactive có bg xám nhạt, hover rõ hơn
            }
            `}
        >
            {status || "ALL"}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 py-8">  {/* Thay đổi: bg-gray-100 thay gray-50 để tương phản tốt hơn, không quá trắng */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>  {/* Giữ nguyên, đã đậm */}

                {/* Tabs với horizontal scroll cho mobile */}
                <div className="relative mb-8">
                    <div className="flex overflow-x-auto space-x-1 pb-4 -mx-4 px-4 scrollbar-hide bg-gray-50 rounded-lg p-2">  {/* Thay đổi: Thêm bg xám nhạt và padding cho tabs container */}
                        <TabButton status={null} isActive={activeTab === null} />
                        {orderStatus.map((status) => (
                            <TabButton
                                key={status}
                                status={status as OrderStatus}
                                isActive={activeTab === status}
                            />
                        ))}
                    </div>
                </div>

                <OrderStatusTab orderStatus={activeTab} />
            </div>
        </div>
    );
};

export default MyOrders;