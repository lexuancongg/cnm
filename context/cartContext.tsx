"use client"
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import CartService from "@/services/cart/cartService";

export const CartContext = createContext({
    numberCartItems: 0,
    fetchNumberCartItems: () => {
    }
});

export function CartProvider({children}: React.PropsWithChildren<{}>) {
    const [numberCartItems, setNumberCartItems] = useState(0);
    
    useEffect(() => {
        fetchNumberCartItems();
    }, []);



    const fetchNumberCartItems = useCallback(() => {
        CartService.getNumberCartItems()
            .then((numberCartItems) => setNumberCartItems(numberCartItems))
            .catch((err) => console.log(err));
    }, [])

    const stateCartContext = useMemo(() => (
            {
                numberCartItems,
                fetchNumberCartItems
            }
        ),[numberCartItems,fetchNumberCartItems]
    );
    return <CartContext.Provider value={stateCartContext}>{children}</CartContext.Provider>

}
export const useCartContext = ()=>{
    const {numberCartItems,fetchNumberCartItems} = useContext(CartContext);
    return  {numberCartItems,fetchNumberCartItems};
}