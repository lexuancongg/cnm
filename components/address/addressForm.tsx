'use client'
import { AddressDetailVm } from "@/models/address/AddressDetailVm";
import React, { FC, useEffect, useState } from "react";
import { FieldErrors, set, useForm, UseFormRegister, UseFormSetValue } from "react-hook-form";
import Input from "../item/input";
import OptionSelect from "../item/optionSelect";
import { CountryVm } from "@/models/address/CountryVm";
import { ProvinceVm } from "@/models/address/ProvinceVm";
import { DistrictVm } from "@/models/address/DistrictVm";
import addressService from "@/services/address/addressService";
import { useParams, useRouter } from "next/navigation";
import { AddressFormValues } from "@/models/address/AddressFormValues ";


type Props = { isDisplay:boolean ,
  register: UseFormRegister<AddressFormValues>,
  handleSubmit: () => void,
  errors: FieldErrors<AddressFormValues>,
  addressInit?: AddressDetailVm ,
  buttonText?: string,
  setValue: UseFormSetValue<AddressFormValues>;
}






const AddressForm: FC<Props> = (
  {
    errors,
    handleSubmit,
    register,
    addressInit,
    buttonText,
    setValue,
    isDisplay = true
  }
) => {


  const params = useParams();
  const id = params.id; 

  const [countries, setCountries] = useState<CountryVm[]>([]);
  const [provinces, setProvinces] = useState<ProvinceVm[]>([]);
  const [districts, setDistricts] = useState<DistrictVm[]>([]);


  useEffect(() => {
    addressService.getCountries()
      .then((resCountries) => {
        setCountries(resCountries);
      })
        .catch((error)=>{
        })
  }, [])

  useEffect(() => {
    if (addressInit) {
      addressService.getProvinces(addressInit.countryId)
        .then((resProvinces) => {
          setProvinces(resProvinces);
        })
      addressService.getDistricts(addressInit.provinceId)
        .then((resDistricts) => {
          setDistricts(resDistricts);
        })
    }
  }, [id])

  const onchangeCountry = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = parseInt(event.target.value);
    addressService.getProvinces(countryId)
      .then((resProvinces) => {
        setProvinces(resProvinces)
      })
  }

  const onchangeProvince = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = parseInt(event.target.value);
    addressService.getDistricts(provinceId)
      .then((resDistricts) => {
        setDistricts(resDistricts);
      })
  }




  return (
    <div className={isDisplay ? '' : 'd-none'}>
      <div className="row">
        <div className="col-lg-6">
          <Input
            labelText="Contact name"
            register={register}
            fieldName="contactName"
            registerOptions={{
              required: { value: true, message: 'This feild is required' },
            }}
            defaultValue={addressInit?.contactName}
            error={errors.contactName?.message}
          
          />
        </div>
        <div className="col-lg-6">
          <Input
            labelText="Phone number"
            register={register}
            fieldName="phoneNumber"
            registerOptions={{
              required: { value: true, message: 'This feild is required' },
            }}
            defaultValue={addressInit?.phoneNumber}
            error={errors.phoneNumber?.message}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-4">
          <OptionSelect
            labelText="Country"
            fieldName="countryId"
            placeholder="Select country"
            defaultValue={addressInit?.countryId}
                options={countries}
            register={register}
            registerOptions={{
              required: { value: true, message: 'Please select country' },
              onChange: onchangeCountry ,
            }}
            error={errors.countryId?.message}
          />
        </div>
        <div className="col-lg-8">
          <OptionSelect
            labelText="Province"
            register={register}
            fieldName="provinceId"
            options={provinces}
            placeholder="Select state or province"
            defaultValue={addressInit?.provinceId}
            registerOptions={{
              required: { value: true, message: 'Please select state or province' },
              onChange: onchangeProvince,
            }}
            error={errors.provinceId?.message}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-5">
          <OptionSelect
            labelText="District"
            register={register}
            fieldName="districtId"
            options={districts}
            placeholder="Select district"
            defaultValue={addressInit?.districtId}
            registerOptions={{
              required: { value: true, message: 'Please select district' },
              onChange: (event: any) => {
                setValue('districtName', event.target.selectedOptions[0].text);
              },
            }}
          />

        </div>
        <div className="col-lg-7">
          <Input
            labelText="specificAddress"
            register={register}
            fieldName="specificAddress"
            defaultValue={addressInit?.specificAddress}
            registerOptions={{
              required: { value: true, message: 'Please input  specificAddress' },
             
            }}
          />

        </div>
      </div>

      <div className="row mt-2">
        <div className="col-lg-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-outline-primary fw-bold px-2 py-2"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>


  )

}
export default AddressForm;