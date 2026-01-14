import {FC, useEffect, useState} from "react";
import {CheckoutItemVm} from "@/models/order/checkout/CheckoutItemVm";
import {formatPrice} from "@/utils/formatPrice";
import {PaymentProvider} from "@/models/payment/PaymentProvider";
import paymentProviderService from "@/services/payment/PaymentProviderService";

type Props = {
    checkoutItems: CheckoutItemVm[],
    handlePaymentMethod:(paymentMethod:string |null)=>void
}
const CheckOutDetail: FC<Props> = ({checkoutItems, handlePaymentMethod}) => {

    const [isPaymentEnabled, setIsPaymentEnabled] = useState<boolean>(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [paymentProviders, setPaymentProviders] = useState<PaymentProvider[]>([]);
    const [selectedPaymentProviderId, setSelectedPaymentProviderId] = useState<number|null>();



    useEffect(() => {
        paymentProviderService.getPaymentProviderEnable()
            .then((responsePaymentProviders) => {
                setPaymentProviders(responsePaymentProviders)
            })
    }, []);

    useEffect(() => {
        if (paymentProviders.length && selectedPaymentProviderId === undefined) {
            setSelectedPaymentProviderId(paymentProviders[0].id);
            handlePaymentMethod(paymentProviders[0].name)
        }
    }, [paymentProviders]);


    const handleChangePaymentProvider = (paymentProviderId: number) => {
        setSelectedPaymentProviderId(selectedPaymentProviderId == paymentProviderId ? null : paymentProviderId)
        handlePaymentMethod(selectedPaymentProviderId == paymentProviderId ? null :
            paymentProviders.find((provider)=> provider.id == paymentProviderId)?.name!

        )

    }

    useEffect(()=>{
        const totalPrice  = checkoutItems.reduce((previousValue, currentValue, currentIndex, array)=>{
            return previousValue + (currentValue.productPrice * currentValue.quantity);
        },0)
        setTotalPrice(totalPrice)
    },[checkoutItems])


    const handelChangeAgreePolicy = (event: any) => {
        setIsPaymentEnabled(event.target.checked)
    }

    return (
        <div className="bg-white shadow-md rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-4">Your Order</h2>

            {/* Products */}
            <div className="flex font-semibold text-gray-600 border-b pb-2">
                <span className="w-1/2">Products</span>
                <span className="w-1/4 text-center">Qty</span>
                <span className="w-1/4 text-right">Price</span>
            </div>

            {checkoutItems?.map((item: any) => (
                <div key={item.productId} className="flex items-center py-2 border-b">
                    <span className="w-1/2">{item.productName}</span>
                    <span className="w-1/4 text-center">{item.quantity}</span>
                    <span className="w-1/4 text-right">
            {formatPrice(item.productPrice)}
          </span>
                </div>
            ))}

            {/* Total */}
            <div className="flex justify-between font-bold text-lg py-3">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
            </div>

            {/* Payment method */}
            <h3 className="font-semibold mb-2">Payment Method</h3>
            <div className="space-y-2">
                {paymentProviders.map((provider: any) => (
                    <label
                        key={provider.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                            selectedPaymentProviderId === provider.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                        }`}
                    >
                        <input
                            type="radio"
                            name="paymentMethod"
                            value={provider.id}
                            checked={selectedPaymentProviderId === provider.id}
                            onChange={() => handleChangePaymentProvider(provider.id)}
                        />
                        {provider.name}
                    </label>
                ))}
            </div>

            {/* Terms */}
            <div className="mt-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" onChange={handelChangeAgreePolicy} />
                    <span className="text-sm text-gray-600">
            Agree to Terms and Conditions
          </span>
                </label>
            </div>

            {/* Checkout button */}
            <button
                disabled={!isPaymentEnabled}
                type="submit"
                className={`w-full mt-4 py-2 rounded-lg font-semibold text-white ${
                    !(isPaymentEnabled)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                }`}
            >
                Process to Payment
            </button>
        </div>
    );

}
export default CheckOutDetail;