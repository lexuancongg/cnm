'use client'
import React, {JSX, useEffect, useState} from "react";
import {AddressDetailVm} from "@/models/address/AddressDetailVm";
import {BiPlusMedical} from "react-icons/bi";
import CardAddress from "@/components/address/cardAddress";
import ConfirmationDialog from "@/components/dialog/confirmDialog";
import userAddressService from "@/services/customer/userAddressService";
import ProfileLayoutComponent from "@/components/profile/profileLayout";
import {useRouter} from "next/navigation";




const MyAddress = (): JSX.Element => {
    const [addresses, setAddresses] = useState<AddressDetailVm[]>([]);
    const [isShowModelDelete, setIsShowModelDelete] = useState<boolean>(false);
    const [isShowModeConfirmChooseAddressDefault, setIsShowModelConfirmChooseAddressDefault] = useState<boolean>(false);
    const [addressWantDeleteId, setAddressWantDeleteId] = useState<number>(0);
    const [addressWantDefaultId, setAddressWantDefaultId] = useState<number>(0);

    const router = useRouter();

    const [currentAddressDefaultId, setCurrentAddressDefaultId] = useState<number|undefined>(0);


    useEffect(() => {
        
        userAddressService.getUserAddressDetail()
            .then( resAddressDetail => {
                setAddresses(resAddressDetail);
                setCurrentAddressDefaultId(resAddressDetail.find(address => address.isActive)?.id)
            })
            .catch((error)=>{
                console.log(error.message)
            })

    }, []);




    // đồng ý xóa địa chỉ
    const handleAgreeDeleteAddressFromModel = () => {
        if (addressWantDeleteId == 0) return;
        userAddressService.deleteUserAddress(addressWantDeleteId)
            .then(() => {
                setIsShowModelDelete(false);
                userAddressService.getUserAddressDetail()
                    .then( resAddressDetail => {
                        setAddresses(resAddressDetail);
                    })




            })
            .catch((error)=>{
                setIsShowModelDelete(false)
            })

    }


    // hủy xóa địa chỉ
    const handleCancelDeleteAddressFromModel = () => {
        setIsShowModelDelete(false)

    }


    // đồng ý địa chỉ mặc đingj
    const handleAgreeAddressDefaultFromModel = () => {
        userAddressService.chooseDefaultAddress(addressWantDefaultId)
        .then((res)=>{
            setIsShowModelConfirmChooseAddressDefault(false)
            setCurrentAddressDefaultId(addressWantDefaultId);
        })
        .catch((error)=>{
            console.log(error)
        })



    }
    // hủy thay đổi địa chỉ mặc định
    const handleCancelAddressDefaultFromModel = () => {
        setIsShowModelConfirmChooseAddressDefault(false);

    }


    // khi click chọn address mặc định
    const handleChooseAddressDefault = (addressId: number) => {
        setIsShowModelConfirmChooseAddressDefault(true);
        setAddressWantDefaultId(addressId);
    }

    const handleChooseDeleteAddress = (addressId: number) => {
        setIsShowModelDelete(true)
        setAddressWantDeleteId(addressId)

    }


    return (
        <>
            <ProfileLayoutComponent menuActive="address" >
                <div className="border border-dashed border-gray-300 p-3 flex justify-center items-center">
                    <button
                        onClick={()=>{
                            router.push("/address/create")
                        }}
                        className="flex items-center text-black">
                        <BiPlusMedical className="text-lg"/>
                        <span className="ml-1">Create address</span>
                    </button>
                </div>


                <div className="flex grid-cols-2 flex-wrap gap-4">
                    {
                        addresses.length == 0 ? <> No address</> :
                            addresses.map(address => {
                                return (
                                    <CardAddress
                                        key={address.id}
                                        currentAddressDefaultId={currentAddressDefaultId}
                                        address={address}
                                        handleChooseAddressDefault={handleChooseAddressDefault}
                                        handleChooseDeleteAddress={handleChooseDeleteAddress}


                                    ></CardAddress>
                                )
                            })
                    }
                </div>

            </ProfileLayoutComponent>



            <ConfirmationDialog
                isShow={isShowModelDelete}
                cancel={handleCancelDeleteAddressFromModel}
                ok={handleAgreeDeleteAddressFromModel}
                cancelText="cancel"
                okText="delete"
            >
                <p>do you want to delete this address</p>
            </ConfirmationDialog>

            <ConfirmationDialog
                isShow={isShowModeConfirmChooseAddressDefault}
                cancel={handleCancelAddressDefaultFromModel}
                ok={handleAgreeAddressDefaultFromModel}
                cancelText="No"
                okText="agree"
            >
                <p>do you want choose this address for default</p>
            </ConfirmationDialog>
        </>
    );
}
export default MyAddress