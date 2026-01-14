"use client"
import React, {Context, PropsWithChildren} from "react";
import {UserInfoProvider} from "@/context/userInfoContext";
import {CartProvider} from "@/context/cartContext";

export const  AppContext : Context<Object> = React.createContext({});

export function AppProvider({children}: React.PropsWithChildren<{}>){
    return (
        <UserInfoProvider>
            <CartProvider>{children}</CartProvider>
        </UserInfoProvider>
    )
}
