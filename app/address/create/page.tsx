'use client'
import AddressForm from "@/components/address/addressForm";
import { useForm } from "react-hook-form";
import { AddressPostVm } from "@/models/address/AddressPostVm";
import ProfileLayoutComponent from "@/components/profile/profileLayout";
import { AddressFormValues } from "@/models/address/AddressFormValues ";
import userAddressService from "@/services/customer/userAddressService";
import {useRouter} from "next/navigation";


export default function CreateAddress() {
    const router= useRouter();
    // Partial : biến các thuộc tính của T thành opational
    const onSubmit = (data: AddressFormValues, event: any) => {
        const {
            specificAddress,
            countryId,
            districtId,
            phoneNumber,
            provinceId,
            contactName
        } = data;


        const addressPostVm: AddressPostVm = {
            contactName: contactName!,
            countryId: countryId,
            specificAddress,
            districtId: districtId,
            phoneNumber,
            provinceId: provinceId
        }


        userAddressService.createUserAddress(addressPostVm)
            .then((response) => {
                router.push('/address')

            }).catch(error => console.log(error))


    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<AddressFormValues>();

    return (
        <ProfileLayoutComponent menuActive="address" >
            <AddressForm
                setValue={setValue}
                register={register}
                handleSubmit={handleSubmit(onSubmit)}
                buttonText="create"
                errors={errors}
                isDisplay={true}
                addressInit={undefined}
            >
            </AddressForm>
        </ProfileLayoutComponent>
    )
}
