'use client'
import React, {ChangeEvent, useCallback, useEffect, useState} from "react";
import ConfirmationDialog from "@/components/dialog/confirmDialog";
import { CartItemDetailVm } from "@/models/cart/CartItemDetailVm";
import Link from "next/link";
import cartService from "@/services/cart/cartService";
import {CartItemPutVm} from "@/models/cart/CartItemPutVm";
import {useUserInfoContext} from "@/context/userInfoContext";
import {CheckoutPostVm} from "@/models/order/checkout/CheckoutPostVm";
import {CheckoutItemPostVm} from "@/models/order/checkout/CheckoutItemPostVm";
import checkoutService from "@/services/order/checkoutService";
import {useRouter} from "next/navigation";
import {useCartContext} from "@/context/cartContext";
import Loader from "@/components/share/loading";



const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItemDetailVm[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<Set<number>>(new Set());
    const [isShowModelConfirmDelete, setIsShowModelConfirmDelete] = useState(false);
    const [productIdToRemove, setProductIdToRemove] = useState<number>(0);
    const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());
    const [isShowLoading,setIsShowLoading] = useState(false);


     const router = useRouter();

    const {email} = useUserInfoContext();
    const  {fetchNumberCartItems} = useCartContext()

    useEffect(() => {
       loadCartItems();
    }, []);

    const loadCartItems = ()=>{
        cartService.getCartItems()
            .then((res)=>{

                setCartItems(res)
            })
            .catch((error)=>{
                console.log(error.message)
            })
    }




    const handleSelectAllCartItemsChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (selectedProductIds.size != cartItems.length) {
            const allProductIds: number[] = cartItems.map(cartItem => cartItem.productId);
            setSelectedProductIds(new Set(allProductIds));
            return;
        }
        setSelectedProductIds(new Set());
    };


    const handleSelectCartItemChange = (productId: number) => {
        setSelectedProductIds((prevSelectedProductIds) => {
            const newSelectedProductIds = new Set(prevSelectedProductIds);
            if (prevSelectedProductIds.has(productId)) {
                newSelectedProductIds.delete(productId);
            } else {
                newSelectedProductIds.add(productId);
            }
            return newSelectedProductIds;
        });
    };



    const handleUpdateCartItemQuantity = async (productId : number, newQuantity: number)=>{
        setLoadingItems((prevLoadingItems)=> {
            const  loadingItemsNew  = new Set<number>(prevLoadingItems);
            loadingItemsNew.add(productId)
            return loadingItemsNew;
        })
        try {
            const cartItemPutVm : CartItemPutVm = {
                quantity : newQuantity
            }
            await  cartService.updateCartItemAboutQuantity(productId,cartItemPutVm)
            loadCartItems();
        }catch (error){

        }finally {
            setLoadingItems((prevLoadingItems)=>{
               const  newLoadingItems = new Set(prevLoadingItems);
               newLoadingItems.delete(productId);
               return newLoadingItems;
            })

        }
    }

    const handleIncreaseQuantity = async (productId: number) => {
        const cartItem = cartItems.find((item) => item.productId === productId);
        if (!cartItem) return;
        const newQuantity = cartItem.quantity + 1;
        await handleUpdateCartItemQuantity(productId, newQuantity);


    };

    const handleDecreaseQuantity = async (productId: number) => {
        const cartItem = cartItems.find((item) => item.productId === productId);
        if (!cartItem) return;
        const newQuantity = cartItem.quantity - 1;
        if (newQuantity < 1) {
            handleShowModelConfirmDelete(productId);
        } else {
            await handleUpdateCartItemQuantity(productId,newQuantity);
        }
    };

    const handleShowModelConfirmDelete = (productId: number) => {
        setProductIdToRemove(productId);
        setIsShowModelConfirmDelete(true);
    };




    const getSelectCartItem = useCallback(()=>{
        return cartItems.filter( cartItem => selectedProductIds.has(cartItem.productId));
    },[cartItems, selectedProductIds])

    const convertCartItemToCheckoutItem = (cartItem : CartItemDetailVm) : CheckoutItemPostVm  =>{
        return {
            productId: cartItem.productId,
            quantity:cartItem.quantity
        }
    }

    const handleCheckout = () =>{
        const cartItemSelected : CartItemDetailVm[] = getSelectCartItem();
        const checkoutItemPostVms : CheckoutItemPostVm[] =  cartItemSelected
            .map(item => convertCartItemToCheckoutItem(item) )

        const checkoutPostVm : CheckoutPostVm = {
            email : email,
            note : "",
            totalPrice : totalSelectedPrice,
            checkoutItemPostVms : checkoutItemPostVms
        };

        setIsShowLoading(true)
        checkoutService.createCheckout(checkoutPostVm)
            .then((res)=>{
                router.push(`/checkout/${res?.id}`); //NOSONAR
            })
    }





    const handleDeleteCartItem = async () => {
        try {
            await  cartService.deleteCartItem(productIdToRemove);
            loadCartItems();
            fetchNumberCartItems();

        }catch (error){

        }
        setIsShowModelConfirmDelete(false);
        setProductIdToRemove(0);
    };

    const totalSelectedPrice = cartItems
        .filter((item) => selectedProductIds.has(item.productId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            {isShowLoading && <Loader></Loader>}
        <div className="min-h-screen  from-purple-100 to-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
                            <span className="text-lg text-gray-600">{cartItems.length} items</span>
                        </div>
                        {cartItems.length === 0 ? (
                            <h4 className="text-center text-gray-600">There are no items in this cart.</h4>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <input
                                        id="select-all-checkbox"
                                        type="checkbox"
                                        className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        onChange={handleSelectAllCartItemsChange}
                                        checked={selectedProductIds.size === cartItems.length}
                                    />
                                    <span className="text-gray-700">Chọn tất cả</span>
                                </div>
                                {cartItems.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedProductIds.has(item.productId)}
                                                onChange={() => handleSelectCartItemChange(item.productId)}
                                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <Link href={`/redirect?productId=${item.productId}`} className="flex-shrink-0">
                                                <img
                                                    src={item.avatarUrl}
                                                    alt={item.productName}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                            </Link>
                                            <div>
                                                <Link href={`/redirect?productId=${item.productId}`}>
                                                    <h6 className="text-gray-800 font-medium">{item.productName}</h6>
                                                </Link>
                                               
                                            </div>
                                        </div>
                                        <div className="text-gray-800 font-semibold">{item.price}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDecreaseQuantity(item.productId)}
                                                className="w-8 h-8 border border-gray-300 rounded-l bg-white hover:bg-gray-100"
                                                disabled={loadingItems.has(item.productId)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                disabled={loadingItems.has(item.productId)}
                                                className="w-12 text-center border-t border-b border-gray-300 focus:outline-none bg-white"
                                                onChange={()=>{}}
                                            />
                                            <button
                                                onClick={() => handleIncreaseQuantity(item.productId)}
                                                className="w-8 h-8 border border-gray-300 rounded-r bg-white hover:bg-gray-100"
                                                disabled={loadingItems.has(item.productId)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => handleShowModelConfirmDelete(item.productId)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="mt-6 text-left">
                            <Link href="/" className="text-blue-600 hover:underline">Back to shop</Link>
                        </div>
                    </div>
                    <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Summary</h3>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex justify-between">
                                <span>ITEMS {selectedProductIds.size}</span>
                                <span>{totalSelectedPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>SHIPPING</span>
                                <select className="p-2 border border-gray-300 rounded w-1/2">
                                    <option value="6.00">Standard Delivery</option>
                                </select>
                            </div>
                            <div className="flex justify-between">
                                <span>GIVE CODE</span>
                                <input
                                    type="text"
                                    placeholder="Enter your code"
                                    className="p-2 border border-gray-300 rounded w-1/2"
                                />
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 mt-4 pt-2 border-t border-gray-200">
                                <span>TOTAL PRICE</span>
                                <span>{totalSelectedPrice}</span>
                            </div>
                        </div>
                        <button
                            disabled={selectedProductIds.size==0}
                            onClick={handleCheckout}
                            className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300">
                            PROCESS CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmationDialog
                isShow={isShowModelConfirmDelete}
                okText="Remove"
                cancelText="Cancel"
                cancel={() => setIsShowModelConfirmDelete(false)}
                ok={handleDeleteCartItem}
            >
                <p>Do you want to remove this product from the cart?</p>
            </ConfirmationDialog>
        </div>
        </div>
    );
};

export default Cart;