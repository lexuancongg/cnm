import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import Link from "next/link";
import {FC} from "react";
import {FaTrash} from "react-icons/fa";
import {FiEdit} from "react-icons/fi";
import {TiContacts} from "react-icons/ti";
import {MdRadioButtonChecked} from "react-icons/md";

type Props = {
    address: AddressDetailVm,
    handleChooseAddressDefault: (addressId: number) => void,
    handleChooseDeleteAddress: (addressId: number) => void,
    currentAddressDefaultId: number|undefined
}
const CardAddress: FC<Props> = (
    {

        address,
        handleChooseAddressDefault,
        handleChooseDeleteAddress,
        currentAddressDefaultId
    }
) => {
    return (
        <div className="col-span-4 w-full md:w-1/2 p-2" key={address.id}>
            <div
                className="flex rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-200">

                {/* Icon */}
                <div className="flex items-center justify-center w-24 bg-gradient-to-b from-blue-500 to-blue-600">
                    <TiContacts className="text-white text-5xl"/>
                </div>

                {/* Content */}
                <div className="p-4 w-full relative">
                    {/* Active badge */}
                    {address.id == currentAddressDefaultId && (
                        <span
                            className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                            Default
                        </span>
                    )}


                    {/* Info */}
                    <div className="space-y-1 text-gray-700">
                        <div className="text-sm font-semibold">
                            Contact: <span className="font-normal">{address.contactName}</span>
                        </div>
                        <div className="text-sm break-words">
                            Address: <span className="font-normal">{address.specificAddress}</span>
                        </div>
                        <div className="text-sm">
                            Phone: <span className="font-normal">{address.phoneNumber}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4 mt-4">
                        <MdRadioButtonChecked
                            className={`cursor-pointer ${address.id == currentAddressDefaultId ? "text-green-500" : "text-gray-400"} hover:text-green-600 transition-colors`}
                            title="Set Default"
                            onClick={() => handleChooseAddressDefault(address.id)}
                        />

                        <Link href={`/address/${address.id}/edit`}>
                            <FiEdit
                                className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors"
                                title="Edit"
                            />
                        </Link>
                        <FaTrash
                            className="cursor-pointer text-red-500 hover:text-red-600 transition-colors"
                            title="Delete"
                            onClick={() => handleChooseDeleteAddress(address.id || 0)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CardAddress;