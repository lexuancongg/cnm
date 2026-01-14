'use client'
import * as yup from 'yup';
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import {CheckoutVm} from "@/models/order/checkout/CheckoutVm";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import {Container} from "react-bootstrap";
import Loading from "@/app/loading";
import AddressForm from "@/components/address/addressForm";
import Input from "@/components/item/input";
import CheckOutAddress from "@/components/order/checkout/CheckOutAddress";
import ModalAddressList from "@/components/order/ModalAddressList";
import {OrderDetailVm} from "@/models/order/OrderDetailVm";
import userAddressService from "@/services/customer/userAddressService";
import orderService from "@/services/order/orderService";
import addressService from "@/services/address/addressService";
import {CheckoutItemVm} from "@/models/order/checkout/CheckoutItemVm";
import {AddressPostVm} from "@/models/address/AddressPostVm";
import CheckOutDetail from "@/components/order/checkout/CheckOutDetail";
import {AddressFormValues} from '@/models/address/AddressFormValues ';
import checkoutService from "@/services/order/checkoutService";
import {toast} from "react-toastify";
import {CheckoutPostVm} from "@/models/order/checkout/CheckoutPostVm";
import {OrderPostVm} from "@/models/order/OrderPostVm";
import {OrderItemPostVm} from "@/models/order/OrderItemPostVm";
import {InitPaymentPaypalRequest} from "@/models/payment/paypal/InitPaymentPaypalRequest";
import paymentService from "@/services/payment/PaymentService";
import Loader from "@/components/share/loading";







const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]*)|(\([0-9]{2,3}\)[ -]*)|[0-9]{2,4}[ -]*)?[0-9]{3,4}?[ -]*[0-9]{3,4}?$/;

const addressShippingSchema = yup.object({
    contactName: yup.string().required('contactName is Require'),
    phoneNumber: yup.string().matches(phoneRegExp, 'phoneNumber is not valid').required(''),
    specificAddress: yup.string().required("specificAddress is require"),
    districtId: yup.number().required('District is required'),
    countryId: yup.number().required('Country is required'),
    provinceId: yup.number().required('Country is required'),

})


const Checkout = () => {
    const params = useParams();
    const id = params.id;

    const [checkout, setCheckout] = useState<CheckoutVm>()



    const [checkoutItems, setCheckoutItems] = useState<CheckoutItemVm[]>([])
    const [shippingAddress, setShippingAddress] = useState<AddressDetailVm>();
    const [isAddShippingAddress, setIsAddShippingAddress] = useState<boolean>(false);
    const [isShowModalShippingAddress, setIsShowModalShippingAddress] = useState<boolean>(false);
    const [currentAddressId, setCurrentAddressId] = useState<number>()
    const [paymentMethod, setPaymentMethod] = useState<string|null>();
    const [isShowLoading, setIsShowLoading] = useState<boolean>(false);


    const {
        register: registerShippingAddress,
        handleSubmit: handleSubmitShippingAddress,
        formState: {errors: errorsShippingAddress},
        setValue: setValueShippingAddress
    } = useForm<AddressFormValues>(
        {
            resolver: yupResolver(addressShippingSchema)
        }
    )

    const {
        handleSubmit: handleSubmitOrder,
        register: registerOrder,
        formState: {errors: errorsOrder},
        watch: watchOrder,
    } = useForm<OrderPostVm>();


    useEffect(() => {
        userAddressService.getDefaultAddress()
            .then((resAddressDefault) => {
                setShippingAddress(resAddressDefault);
                setCurrentAddressId(resAddressDefault.id);
            }).catch((error) => {
                setIsAddShippingAddress(true)
        })
    }, []);

    useEffect(() => {
        if (id) {
            checkoutService.getCheckoutById(parseInt(id as string))
                .then((responseCheckoutVm) => {
                    setCheckout(responseCheckoutVm)
                    setCheckoutItems(responseCheckoutVm.checkoutItemVms);
                })
                .catch((error)=>{
                    console.log(error.message);
                })
        }
    }, [id]);


    const handleCloseModalShippingAddress = () => {
        setIsShowModalShippingAddress(false)
    }

    const handleSelectedShippingAddress = (address: AddressDetailVm) => {
        setIsAddShippingAddress(false)
        setShippingAddress(address);
        setCurrentAddressId(address.id)
    }



    const onSubmitShippingAddress = async (data: AddressFormValues) => {
        const newAddress = await performCreateUserAddress(data);
        setShippingAddress(newAddress);
        setIsAddShippingAddress(false)

    }

    const performCreateUserAddress = async (address: AddressFormValues): Promise<AddressDetailVm> => {
        let addressCreated;
        try {
            const {addressVm: newAddress} = await userAddressService.createUserAddress(address as AddressPostVm)
            addressCreated = newAddress;
        } catch (error) {
            console.log(error)
        }
        let addressDetailCreated: AddressDetailVm = addressCreated as AddressDetailVm;
        try {
            if (addressDetailCreated.id != null) {
                addressDetailCreated = await addressService.getAddressById(addressDetailCreated.id);
            }

        } catch (error) {
            console.log(error)
        }
        return addressDetailCreated;

    }


    const handleOnSubmit =  (data:OrderPostVm)=>{

        const orderPostVm = watchOrder();
        if(!shippingAddress){
            toast.error('Please choose shipping address!');
            return
        }
        if(!paymentMethod){
            toast.error('Please choose PaymentMethod!');
            return;
        }
        const orderItems :OrderItemPostVm[] = checkoutItems.map(value => {
            return {
                productId : value.productId,
                quantity:value.quantity,
                productName:value.productName,
                totalPrice:value.productPrice * value.quantity,
                productPrice:value.productPrice,

            }
        })
        orderPostVm.email = checkout?.email;
        orderPostVm.shippingAddress = shippingAddress;
        orderPostVm.paymentMethod = paymentMethod;
        orderPostVm.checkoutId = Number(id);
        orderPostVm.note = data.note;
        orderPostVm.numberItem = checkoutItems.reduce((previousValue, currentValue) => {
            return previousValue + currentValue.quantity;
        },0)
        orderPostVm.totalPrice = checkoutItems.reduce((previousValue, currentValue) => {
            return previousValue + (currentValue.quantity * currentValue.productPrice)
        },0)
        orderPostVm.paymentMethod =paymentMethod
        orderPostVm.orderItemPostVms = orderItems
        setIsShowLoading(true)

        orderService.createOrder(orderPostVm)
            .then((res)=>{
                handlePaymentProcess(orderPostVm)
            }).catch((error)=>{
                console.log(error)
            setIsShowLoading(false)
        })

    }


    const handlePaymentProcess = (order:OrderPostVm)=>{
        const paymentMethod = order.paymentMethod;
        switch (paymentMethod.toUpperCase()) {
            case 'PAYPAL':
                redirectToPaypal(order);
                break;

        }

    }

    const redirectToPaypal = async (order:OrderPostVm)=>{
        const initPaymentPaypalRequest : InitPaymentPaypalRequest = {
            orderId:order.checkoutId,
            paymentMethod:order.paymentMethod,
            totalPrice:order.totalPrice
        }
        const initPaymentResponse = await paymentService.initPaymentPaypal(initPaymentPaypalRequest);
        console.log("inti" , initPaymentResponse)
        const redirectUrl = initPaymentResponse.redirectUrl;
        window.location.replace(redirectUrl);

    }



    const handlePaymentMethod = ( paymentMethod : string|null)=>{
        setPaymentMethod(paymentMethod)
    }

    return (
        <Container>
            {isShowLoading && <Loader></Loader>}
            <section className="checkout spad">
                <div className="checkout__form">
                    <form onSubmit={(event) => handleSubmitOrder(handleOnSubmit)(event)}>
                        <div className="row">
                            <div className="col-lg-7 col-md-6">
                                <h4>Shipping Address</h4>
                                <div className="row mb-4">
                                    <div className="checkout__input">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary fw-bold btn-sm me-2"
                                            onClick={() => {
                                                setIsAddShippingAddress(false);
                                                setIsShowModalShippingAddress(true);
                                            }}
                                        >
                                            Change address <i className="bi bi-plus-circle-fill"></i>
                                        </button>
                                        <button
                                            type="button"
                                            className={`btn btn-outline-primary fw-bold btn-sm ${
                                                isAddShippingAddress ? `active` : ``
                                            }`}
                                            onClick={() => setIsAddShippingAddress(true)}
                                        >
                                            Add new address <i className="bi bi-plus-circle-fill"></i>
                                        </button>
                                    </div>

                                    <div className="checkout-address-card">
                                        <CheckOutAddress address={shippingAddress} isDisplay={!isAddShippingAddress}/>

                                        <AddressForm
                                            handleSubmit={handleSubmitShippingAddress(onSubmitShippingAddress)}
                                            isDisplay={isAddShippingAddress}
                                            register={registerShippingAddress}
                                            setValue={setValueShippingAddress}
                                            errors={errorsShippingAddress}
                                            addressInit={undefined}
                                            buttonText="Use this address"
                                        />
                                    </div>
                                </div>


                                <h4>Additional Information</h4>
                                <div className="row mb-4">
                                    <div className="checkout__input">
                                        <Input
                                            labelText="Order Notes"
                                            fieldName="note"
                                            register={registerOrder}
                                            placeholder="Notes about your order"
                                            error={errorsOrder.note?.message}
                                            defaultValue={checkout?.note}
                                        />
                                    </div>
                                    <div className="checkout__input">
                                        <Input
                                            labelText="Email"
                                            fieldName="email"
                                            register={registerOrder}
                                            defaultValue={checkout?.email}
                                            error={errorsOrder.email?.message}
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="col-lg-5 col-md-6">
                                <CheckOutDetail
                                    checkoutItems={checkoutItems}
                                    handlePaymentMethod={handlePaymentMethod}
                                ></CheckOutDetail>

                            </div>
                        </div>
                    </form>


                    <ModalAddressList
                        isShow={isShowModalShippingAddress}
                        handleCloseModel={handleCloseModalShippingAddress}
                        handleSelectAddress={handleSelectedShippingAddress}
                        currentAddressId={currentAddressId}

                    />

                </div>
            </section>
        </Container>
    )


}
export default Checkout;