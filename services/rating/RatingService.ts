import apiClient from "@/utils/api/apiClient";
import {RatingPagingVm} from "@/models/rating/RatingPagingVm";
import {RatingPost} from "@/models/rating/RatingPost";

class RatingService{
    private baseUrl: string
    constructor() {
        this.baseUrl = "http://localhost:8000/customer/feedbacks"

    }

    public async getAverageStarByProductId(productId: number):Promise<number>{
        const response = await apiClient.get(`${this.baseUrl}/${productId}/average-star`);
        if(response.ok) {
            return response.json();
        }
        throw response;
    }

    public async getRatingsByProductId(productId: number , pageIndex: number, pageSize : number ):Promise<RatingPagingVm>{
        const response  = await  apiClient.get(`${this.baseUrl}/${productId}`);
        if(response.ok){
            return response.json();
        }
        throw response;
    }

    public async createRating(ratingPost:RatingPost){
        const response = await  apiClient.post(this.baseUrl , JSON.stringify(ratingPost));
        if(response.ok){
            return response.json();
        }
        throw response;

    }


}
export default new RatingService();