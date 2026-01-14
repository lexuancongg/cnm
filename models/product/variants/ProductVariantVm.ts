import {ImageVm} from "@/models/image/imageVm";

export type ProductVariantVm = {
    id : number,
    name : string,
    slug: string,
    sku: string,
    gtin: string,
    price: number,
    avatarUrl: string,
    productImages: {
        id: number,
        url: string
    }[],
    optionValues:{
        [key:number] : string
    }



}