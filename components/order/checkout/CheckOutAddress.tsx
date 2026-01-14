import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import {FC} from "react";

type  Props ={
    isDisplay:boolean,
    address: AddressDetailVm|undefined
}
const CheckoutAddress :FC<Props>= ({address,isDisplay})=>{
    const addressString = address
        ? `${address.specificAddress}, ${address.districtName}, ${address.provinceName}, ${address.countryName}`
        : 'Please choose address';
    return (
        <div className={`address ${isDisplay ? `` : `d-none`}`}>
            <div className="row">
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="firstName">
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control`}
                                value={address?.contactName ?? ''}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="checkout__input">
                        <div className="mb-3">
                            <label className="form-label" htmlFor="firstName">
                                Phone <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={`form-control`}
                                value={address?.phoneNumber ?? ''}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="checkout__input">
                <div className="mb-3">
                    <label className="form-label" htmlFor="firstName">
                        Address <span className="text-danger">*</span>
                    </label>
                    <input type="text" className={`form-control`} value={addressString} disabled={true} />
                </div>
            </div>
        </div>
    );

}
export default CheckoutAddress;