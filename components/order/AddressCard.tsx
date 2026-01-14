import {AddressDetailVm} from "@/models/address/AddressDetailVm";

type Props = {
    address: AddressDetailVm;
    isSelected:boolean
};

const AddressCard = ({ address, isSelected }:Props) => {
    return (
        <div
            className={`address-card position-relative mb-4 ps-3 d-flex flex-column border-bottom border-secondary p-2 text-dark ${
                isSelected ? 'border border-primary rounded' : ''
            }`}
        >
            {isSelected && (
                <span className="badge bg-primary position-absolute top-0 end-0 m-2">Selected</span>
            )}
            <span className="fw-bold mb-1">Name: {address.contactName} </span>
            <span>Phone: {address.phoneNumber} </span>
            <span>
        Address: {address.specificAddress} {address.districtName} {address.provinceName}{' '}
                 {address.countryName}
      </span>
        </div>
    );
};

export default AddressCard;
