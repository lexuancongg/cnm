import {AddressPostVm} from "@/models/address/AddressPostVm";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import apiClient from "@/utils/api/apiClient";
import {UserAddressVm} from "@/models/customer/UserAddressVm";

class UserAddressService {
    private baseUrl: string ;
    constructor() {
        this.baseUrl = "http://localhost:8000/customer/user-address"
    }



    public async getDefaultAddress():Promise<AddressDetailVm>{
        const response = await apiClient.get(`${this.baseUrl}/default`)
        if (response.ok) {
            return await response.json();
        }
        throw response;
    }



    public async createUserAddress(addressPostVm : AddressPostVm):Promise<UserAddressVm>{
        const response  = await apiClient.post(`${this.baseUrl}`,JSON.stringify(addressPostVm));
        if(response.ok) {
            return await response.json();
        }
        throw response;

    }


    public async getUserAddressDetail():Promise<AddressDetailVm[]>{
        const response = await apiClient.get(`${this.baseUrl}/addresses`);
        if (response.ok){
            return await  response.json();
        }
        throw response;
    }


    public async chooseDefaultAddress(addressId: number){
        const response  = await  apiClient.put(`${this.baseUrl}/${addressId}`);
        console.log(response.status)
       return response;
    }





    public async deleteUserAddress(addressId: number) {
        const response = await apiClient.delete(`${this.baseUrl}/${addressId}`);
        return response;
        throw response;


    }









}
export default new UserAddressService();