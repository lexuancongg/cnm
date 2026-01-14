import apiClient from "@/utils/api/apiClient";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import {address_demo_data} from "@/demo_data/address/address_demo_data";
import { AddressPostVm } from "@/models/address/AddressPostVm";
import {CountryVm} from "@/models/address/CountryVm";
import {ProvinceVm} from "@/models/address/ProvinceVm";

class AddressService {
    private baseUrl:string
    constructor() {
        this.baseUrl = "http://localhost:8000/customer"
    }



    public async getCountries():Promise<CountryVm[]>{
        const response = await apiClient.get(`${this.baseUrl}/countries`);
        if(response.ok){
            return await response.json();
        }
        throw response;
    }

    public async getProvinces(countryId: number):Promise<ProvinceVm[]>{
        const response = await apiClient.get(`${this.baseUrl}/provinces/${countryId}`);
        if(response.ok) {
            return await response.json();
        }
        throw response;
    }
    //
    public async getDistricts(provinceId: number){
        const response = await apiClient.get(`${this.baseUrl}/districts/${provinceId}`)
        if(response.ok) {
            return await response.json();
        }
        throw response;
    }
    //
    //


    public async getAddressById(addressId :number):Promise<AddressDetailVm>{
        const response  = await apiClient.get(`${this.baseUrl}/address/${addressId}`);
        if(response.ok) {
            return await response.json();
        }
        throw response;

    }
    public async updateAddressById(addressId:number, addressPostVm : AddressPostVm ):Promise<void>{
        const response  = await apiClient.put(`${this.baseUrl}/addresses/${addressId}`, JSON.stringify(addressPostVm));

    }
}
export default new AddressService();