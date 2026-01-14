import {CartItemDetailVm} from "@/models/cart/CartItemDetailVm";

import apiClient from "@/utils/api/apiClient";
import productService from "@/services/product/productService";
import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import {CartItemPutVm} from "@/models/cart/CartItemPutVm";
import {cartItems_demo_data} from "@/demo_data/cart/cart_demo_data";
import {CartItemVm} from "@/models/cart/CartItemVm";
import {CartItemPostVm} from "@/models/cart/CartItemPostVm";

class CartService{
    private  baseUrl : string = `http://localhost:8000/cart`;
    public  async getNumberCartItems():Promise<number>{
        return (await this.getCartItems()).length;
    }


    public async updateCartItemAboutQuantity(productId:number , cartItemPutVm:CartItemPutVm){
        const response = await apiClient.put(
            `${this.baseUrl}/customer/cart-items/`+productId
            ,JSON.stringify(cartItemPutVm)
        );
        if(!response.ok){
           throw response;
        }
        return await response.json();

    }

    public async  getCartItems():Promise<CartItemDetailVm[]>{
        const response = await apiClient.get(`${this.baseUrl}/customer/cart-items`)
        if(response.ok){
            return await  response.json();
        }
        throw response;
    }

    public  deleteCartItem = async (productId: number)=>{
        const response = await apiClient.delete(`${this.baseUrl}/customer/cart-items/` + productId)
        if(!response.ok){
            throw response;
        }

    }


    public addCartItem = async (cartItemPostVm : CartItemPostVm)=>{
        const response = await  apiClient.post(`${this.baseUrl}/customer/cart-items`,JSON.stringify(cartItemPostVm))
        if(response.ok){
            return await response.json();
        }
        throw  response;
    }


}

export default  new CartService();