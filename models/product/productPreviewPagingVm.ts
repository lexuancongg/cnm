import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";

export type ProductPreviewPagingVm = {
    productPreviewsPayload: ProductPreviewVm[],
    pageIndex: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    isLast : boolean


}