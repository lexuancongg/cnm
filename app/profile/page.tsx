'use client'
import {NextPage} from "next";
import {useEffect, useState} from "react";
import customerService from "@/services/customer/customerService";
import {CustomerVm} from "@/models/customer/CustomerVm";
import ProfileLayout from "@/components/profile/profileLayout";
import ProfileInfoForm from "@/components/profile/profileInfoForm";
import {useForm} from "react-hook-form";
import {CustomerProfilePutVm} from "@/models/customer/CustomerProfilePutVm";

const Profile : NextPage = ()=>{
    const [customer,setCustomer] = useState<CustomerVm>()
    const {
        register,
        setValue,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<CustomerVm>();

    useEffect(() => {
        customerService.getMyProfile()
            .then(res => {
                setCustomer(res)
                Object.keys(res).forEach(key => {
                    setValue(key as keyof CustomerVm, res[key as keyof CustomerVm]);
                });
            })
            .catch(err=>{
                console.log(err)
            })

    }, []);

    const onSubmit  = (customerVm:CustomerVm)=>{
        const profileRequest : CustomerProfilePutVm = {
            email: customerVm.email,
            firstName:customerVm.firstName,
            lastName:customerVm.lastName
        }
        console.log(profileRequest)
        customerService.updateCustomerProfile(profileRequest)
            .then(res=>{

            })
            .catch(eror=>{
                console.log(eror)
            })


    }

    return (
        <ProfileLayout menuActive={"profile"}>
            <ProfileInfoForm
                profileInfo={customer}
                register={register} handleSubmit={handleSubmit(onSubmit)} errors={errors} setValue={setValue}>

            </ProfileInfoForm>
        </ProfileLayout>
    )
}

export default Profile