"use client"
import React from "react";
import {AppProvider} from "@/context/appContext";
import Layout from "@/components/share/layout";

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/modules/share/global.css';
import '../styles/modules/home/home.css';
import '../styles/modules/order/checkout/checkout.css';





import { Geist } from 'next/font/google'
import {ToastContainer} from "react-toastify";

const geist = Geist({
    weight:'400',
    subsets: ['latin'],
})

function App({children}: React.PropsWithChildren) {
    return (
        <html lang={"en"} className={geist.className}>
        <body>
        <AppProvider>
            <Layout>
                {children}
            </Layout>
            <ToastContainer style={{ marginTop: '70px' }} />
        </AppProvider>
        </body>
        </html>

    )
}

export default App;