import {SearchParam} from "@/models/search/SearchParams";
import {ProductPreviewPagingVm} from "@/models/product/productPreviewPagingVm";
import apiClient from "@/utils/api/apiClient";
import {productFeaturePagingVm_demo} from "@/demo_data/product/product_demo_data";

class SearchService {
    constructor() {
    }

    public async searchProduct(queryParams: SearchParam): Promise<ProductPreviewPagingVm> {

        const response  = await apiClient.get('/api');
        if(response.ok) return await response.json();
        return productFeaturePagingVm_demo;
        throw response;
    }

}

export default new SearchService();