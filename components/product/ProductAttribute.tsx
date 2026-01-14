import { ProductDetailVm } from "@/models/product/productDetailVm";

type Props = {
    productDetail: ProductDetailVm;
};

export default function ProductAttribute({ productDetail }: Props) {
    return (
        <div className="container mx-auto mt-16 px-4">
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                    <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                        <div className="w-1 h-5 bg-blue-600 rounded" />
                        Thông số
                    </h2>
                </div>

                {/* Table */}
                {productDetail.attributeGroupValues.length > 0 ? (
                    <div className="p-6 overflow-x-auto">
                        {productDetail.attributeGroupValues.map((group) => (
                            <div key={group.name} className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">{group.name}</h3>
                                <table className="w-full text-sm text-left border-collapse">
                                    <tbody>
                                    {group.attributeValues.map((attr) => (
                                        <tr key={attr.name} className="border-t border-gray-100 hover:bg-blue-50 transition-colors">
                                            <td className="py-2 px-3 text-gray-600 font-medium">{attr.name}</td>
                                            <td className="py-2 px-3 text-gray-900">{attr.value}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center text-gray-500 italic py-8">
                        Không có thông số chi tiết
                    </div>
                )}
            </div>
        </div>
    );
}
