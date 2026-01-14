import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import apiClient from "@/utils/api/apiClient";
import {ProductPreviewPagingVm} from "@/models/product/productPreviewPagingVm";
import {ProductVariantVm} from "@/models/product/variants/ProductVariantVm";
import {ProductDetailVm} from "@/models/product/productDetailVm";
import {SpecificProductVariantVm} from "@/models/product/specific_variant/SpecificProductVariantGetVm";

class ProductService {
    private baseUrl:string ;

    constructor() {
         this.baseUrl = "http://localhost:8000/api/product/customer/products"
    }

    public  async  getDetailProductBySlug(slug: string):Promise<ProductDetailVm>{
        const response = await apiClient.get(`${this.baseUrl}/${slug}`);
        if(response.ok){
            return await response.json();
        }

        throw  response;

    }


    public async  getFeaturedProductsPaging(pageIndex: number):Promise<ProductPreviewPagingVm>{
        const response = await apiClient.get(`${this.baseUrl}/featured?pageIndex=${pageIndex}`);
        if(response.ok) {
            return await  response.json();
        }
        throw response;
    }


    public async getSpecificProductVariantsByProductId(parentProductId: number):Promise<SpecificProductVariantVm[]>{
        const response = await apiClient.get(`http://localhost:8000/specific-product-variants/${parentProductId}`)
        if(response.ok){
            return  await response.json();
        }
        throw response;


    }
    public async  getProductBestSeller():Promise<ProductPreviewVm[]>{
        const response = await  apiClient.get(`${this.baseUrl}/best-seller`);
        if(response.ok){
            return  await  response.json();
        }
        throw  response;
    }


    public async getProductVariationsByParentId(parentProductId: number) : Promise<ProductVariantVm[]>{
        const response = await  apiClient.get(`${this.baseUrl}/product-variations/${parentProductId}`);
        if(response.ok) {
            return  await response.json();
        }

        throw  response;


    }


    public async getProductByMultiParams(predicates:string):Promise<ProductPreviewPagingVm>{
        const response  = await apiClient.get(`${this.baseUrl}/filter?${predicates}`);
        if(response.ok) return await response.json();
        throw response;


    }















    public async getProductsByIds(ids : number[]):Promise<ProductPreviewVm[]>{
        const response = await apiClient.get(`${this.baseUrl}/customer/products?productIds=${ids}`)
        if(response.ok){
            return  await response.json();
        }

        throw new Error();
    }















}
export default new ProductService();
