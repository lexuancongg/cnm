import {CategoryVm} from "@/models/category/CategoryVm";
import apiClient from "@/utils/api/apiClient";

class CategoryService{
    private baseUrl ;
    constructor(){
        this.baseUrl = "http://localhost:8000/api/customer/categories"
    }


    public async getCategories():Promise<CategoryVm[]>{
        const response = await apiClient.get(`${this.baseUrl}`);

        if(response.ok){
            return await response.json();
        }
        throw response;

    }

}
export default new CategoryService();