'use client'
import {createContext, useContext} from "react";
import {ProductDetailVm} from "@/models/product/productDetailVm";
import {ProductOptionValuesVm} from "@/models/product/options/ProductOptionValuesVm";
import {ProductVariantVm} from "@/models/product/variants/ProductVariantVm";

type ProductContextType = {
    productDetail: ProductDetailVm;
};

export const ProductDetailContext = createContext<ProductContextType | null>(null);

export const useProductDetailContext = () => {
    return useContext(ProductDetailContext);
}

export default function ProductDetailProvider(
    {
        children,
        value
    }: {
        children: React.ReactNode;
        value: {
            productDetail: ProductDetailVm;
        }
    }) {
    return (
        <ProductDetailContext.Provider value={value}>
            {children}
        </ProductDetailContext.Provider>
    );
}
