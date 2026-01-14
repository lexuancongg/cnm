'use client';

import { ProductDetailVm } from "@/models/product/productDetailVm";
import { ProductOptionValuesVm } from "@/models/product/options/ProductOptionValuesVm";
import { ProductVariantVm } from "@/models/product/variants/ProductVariantVm";
import ProductDetailProvider from "@/context/productDetailContext";

export default function ClientProductDetailLayout({
                                                      children,
                                                      productDetail,
                                                      productOptionValues,
                                                      productVariations,
                                                  }: {
    children: React.ReactNode;
    productDetail: ProductDetailVm;
    productOptionValues: ProductOptionValuesVm[];
    productVariations: ProductVariantVm[];
}) {
    return (
        <ProductDetailProvider
            value={{
                productDetail,
                productOptionValues,
                productVariations
            }}
        >
            {children}
        </ProductDetailProvider>
    );
}
