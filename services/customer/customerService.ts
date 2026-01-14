import apiClient from "@/utils/api/apiClient";
import {CustomerVm} from "@/models/customer/CustomerVm";
import {CustomerProfilePutVm} from "@/models/customer/CustomerProfilePutVm";
import { authenticationInfoVm } from "@/components/share/userAuthInfo";

class CustomerService{
    private baseUrl : string = `http://localhost:8000`
    public  async getMyProfile():Promise<CustomerVm>{
        
        const response = await apiClient.get(`${this.baseUrl}/api/customers/profile`)
        if(response.ok){
            return await response.json();
        }
        throw response;
        

    }



    public  async  getAuthenticationInfo(): Promise<authenticationInfoVm> {
        const response = await apiClient.get('http://localhost:8000/authentication')
        if(response.ok){
            return await response.json();
        }
        throw response;

    }



    public async updateCustomerProfile(profileRequest : CustomerProfilePutVm):Promise<any> {
        const response = await apiClient.put(`${this.baseUrl}/customer/profile`,JSON.stringify(profileRequest));
        if(response.status == 204){
            return  response;
        }
        return await response.json();
    }




}
export default new CustomerService();