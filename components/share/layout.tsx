import Head from "next/head";
import React from "react";
import Header from "@/components/share/header";
import Footer from "@/components/share/footer";
import UserAuthInfo from "@/components/share/userAuthInfo";

// children : component of routing
export default function  Layout({children}:React.PropsWithChildren){
    return (
        <>
            <Head>
                <title>Cnm -  Shop</title>
            </Head>
            <Header>
                <UserAuthInfo/>
            </Header>
            <div className="body">{children}</div>
            <Footer/>

        </>
    )

}