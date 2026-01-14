import {ProductOptionValueVm} from "@/models/product/options/ProductOptionValueVm";

export type CartItemDetailVm = {
    productId:number;
    quantity:number;
    productName: string;
    slug: string;
    avatarUrl: string;
    price: number;
    productOptionValue: ProductOptionValueVm[]
}

