import {AttributeGroupValueVm} from "@/models/product/attribute/AttributeGroupValueVm";

export  type  ProductDetailVm = {
    id: number,
    name: string,
    authorName: string,
    categories : string[],
    description: string,
    specifications: string,
    price : number,
    avatarUrl : string,
    productImageUrls : string[]

}