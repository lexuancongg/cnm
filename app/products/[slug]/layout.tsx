// "use client" // bỏ vào vì vấn đề cookie
import { cookies } from 'next/headers';

import React from "react";
import { ProductVariantVm } from "@/models/product/variants/ProductVariantVm";
import productService from "@/services/product/productService";
import { ProductDetailVm } from "@/models/product/productDetailVm";
import { ProductOptionValuesVm } from "@/models/product/options/ProductOptionValuesVm";
import ProductDetailProvider, { ProductDetailContext } from "@/context/productDetailContext";
import { SpecificProductVariantVm } from "@/models/product/specific_variant/SpecificProductVariantGetVm";




const fetchDetailProduct = async (slug: string, jsessionid: string | undefined): Promise<ProductDetailVm | null> => {

    try {
        // const  product  = await productService.getDetailProductBySlug(slug);
        const response = await fetch(`http://localhost:8000/api/product/customer/products/${slug}`, {
            headers: {
                cookie: jsessionid ? `JSESSIONID=${jsessionid}` : '',
            },
        });
        return await response.json();
    } catch (error) {
        console.log("error fetchDetailProduct", error)
        return null;

    }
}

export default async function ProductDetailLayout(
    {
        children,
        params
    }: {
        children: React.ReactNode,
        params: Promise<{
            slug: string
        }>
    }
) {


    const { slug } = await params;
    const cookieStore = await cookies();
    const jsessionid = cookieStore.get('JSESSIONID')?.value; // lấy cookie cụ thể



    const product = await fetchDetailProduct(slug as string, jsessionid);


    if (product == null) {
        return;
    }

    return (
        <ProductDetailProvider value={{
            productDetail: product,
        }}>{children}
        </ProductDetailProvider>
    );






}