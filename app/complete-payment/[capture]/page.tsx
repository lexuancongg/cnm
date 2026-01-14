'use client'


import {useParams, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {CapturePaymentRequest} from "@/models/payment/paypal/CapturePaypalRequest";
import paymentService from "@/services/payment/PaymentService";
import {Container} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import SpinnerComponent from "@/components/share/SpinnerComponent";
import Link from 'next/link';

const CompletePayment = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const paymentMethod = searchParams.get('paymentMethod');
    const [isShowSpinner, setIsShowSpinner] = useState(false);

    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [isAlreadyPaid, setIsAlreadyPaid] = useState(false);
    const [isCancelPayment, setIsCancelPayment] = useState(false);
    const [isPaymentUnsuccessful, setIsPaymentUnsuccessful] = useState(false);




    useEffect(() => {
        if(token){
            const fetchCapturePaymentPaypal = async (capturePaypalRequest:CapturePaymentRequest)=>{
                setIsShowSpinner(true);
                const response  = await paymentService.capturePaymentPaypal(capturePaypalRequest);
                if (response.paymentStatus == 'COMPLETED') {
                    setIsPaymentSuccess(true);
                }
                setIsShowSpinner(false);


            }
            const capturePaypalRequest : CapturePaymentRequest = {
                token: token as string,
                paymentMethod:paymentMethod as string
            }

            fetchCapturePaymentPaypal(capturePaypalRequest);




        }
    }, [searchParams.toString(),token,paymentMethod]);

    return (
        <>
            <Container>
                <section className="spad">
                    <div className="container">
                        <SpinnerComponent show={isShowSpinner}></SpinnerComponent>
                        <div className="complete-payment">
                            <div className="payment-result">
                                <div hidden={!isPaymentSuccess} className="payment-success">
                                    <h1>
                                        <i className="bi bi-check2"></i> YOUR ORDER PAID SUCCESSFUL
                                    </h1>
                                </div>
                                <div hidden={!isCancelPayment} className="payment-fail">
                                    <h1>
                                        <i className="bi bi-exclamation-triangle"></i> YOUR PAYMENT IS CANCELED
                                    </h1>
                                </div>
                                <div hidden={!isAlreadyPaid} className="payment-fail">
                                    <h1>
                                        <i className="bi bi-exclamation-triangle"></i> YOUR ORDER ALREADY PAID
                                    </h1>
                                </div>
                                <div hidden={!isPaymentUnsuccessful} className="payment-fail">
                                    <h1>
                                        <i className="bi bi-exclamation-triangle"></i> YOUR ORDER PURCHASE UNSUCCESSFUL{' '}
                                    </h1>
                                </div>
                            </div>
                            <div>
                                <Link href={'/'}>
                                    <Button className="back-to-home-btn">
                                        <i className="bi bi-house-fill"></i> CONTINUE SHOPPING
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </Container>
        </>
    );


};

export default CompletePayment;
