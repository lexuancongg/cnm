import React, {FC} from "react";
import {FieldErrors, UseFormRegister, UseFormSetValue} from "react-hook-form";
import {CustomerVm} from "@/models/customer/CustomerVm";
import Input from "@/components/item/input";
import Link from "next/link";

type Props = {
    register: UseFormRegister<CustomerVm>,
    // submit
    handleSubmit: () => void,
    errors: FieldErrors<CustomerVm>,
    // trường hợp có nếu update , còn undefine nếu create
    profileInfo?: CustomerVm
    // xác định tên nút là create hay update
    setValue: UseFormSetValue<CustomerVm>;
}
const ProfileInfoForm: FC<Props> = (
    {
        errors,
        handleSubmit,
        profileInfo,
        setValue,
        register
    }
) => {

    const fields = [
        {label: "Username", name: "username", disabled: true, required: true},
        {label: "First Name", name: "firstName", required: true},
        {label: "Last Name", name: "lastName", required: true},
        {label: "Email", name: "email", required: true},
    ];
    return (
        <>
            {
                fields.map(
                    field => (
                        <div className="row" key={field.name}>
                            <div className="col-lg-9">
                                <Input
                                    labelText={field.label}
                                    register={register}
                                    fieldName={field.name as keyof CustomerVm}
                                    disabled={field.disabled || false}
                                    defaultValue={profileInfo?.[field.name as keyof CustomerVm]}
                                    registerOptions={
                                        field.required
                                            ? {required: {value: true, message: "This field is required"}}
                                            : undefined
                                    }
                                    error={errors[field.name as keyof CustomerVm]?.message}

                                />
                            </div>
                        </div>
                    )
                )
            }
            <div className="text-center">
                <button onClick={handleSubmit} className="btn btn-primary" type="button">
                    Update
                </button>
                <Link href="/">
                    <button className="btn btn-secondary m-3">Cancel</button>
                </Link>
            </div>

        </>
    )


}
export default ProfileInfoForm;