import {FC, useEffect, useState} from "react";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import Modal from "react-bootstrap/Modal";
import AddressCard from "@/components/order/AddressCard";
import userAddressService from "@/services/customer/userAddressService";

type Props = {
    isShow: boolean,
    handleCloseModel: () => void,
    handleSelectAddress: (address: AddressDetailVm) => void,
    currentAddressId?: number
}





const ModalAddressList: FC<Props> = (
    {
        handleCloseModel,
        isShow,
        handleSelectAddress,
        currentAddressId
    }
) => {

    const [addresses, setAddresses] = useState<AddressDetailVm[]>([])
    useEffect(() => {
        if (!isShow) return;
        userAddressService.getUserAddressDetail()
            .then((responseAddressDetailVm) => {
                setAddresses(responseAddressDetailVm)
            })
            .catch(error =>{

            })

    }, [isShow]);


    const handleClickAddress = (address: AddressDetailVm) => {
        handleSelectAddress(address);
        handleCloseModel();
    }

    return (
        <Modal show={isShow} onHide={() => handleCloseModel()} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-dark fw-bold">Select address</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{minHeight: '500px'}}>
                <div className="body">
                    <div className="row">
                        {addresses.length == 0 ? (
                            <div className="mx-2">Please add your address in your profile</div>
                        ) : (
                            addresses.map((address) => (
                                <div
                                    className="col-lg-6 mb-2"
                                    onClick={() => {
                                        handleClickAddress(address)
                                    }}
                                    key={address.id}
                                >
                                    <AddressCard address={address} isSelected={address.id==currentAddressId}/>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

}
export default ModalAddressList;