import type { NextPage } from 'next';
import { AuthorVm } from '../../../modules/catalog/models/Brand';
import { createBrand } from '../../../modules/catalog/services/BrandService';
import React from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';
import BrandGeneralInformation from '../../../modules/catalog/components/BrandGeneralInformation';
import { AUTHOR_URL } from '../../../constants/Common';
import { handleCreatingResponse } from '../../../common/services/ResponseStatusHandlingService';

const BrandCreate: NextPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<AuthorVm>();


  const handleSubmitBrand = async (event: AuthorVm
  ) => {
    let brand: AuthorVm = {
      id: 0,
      name: event.name,
    };

    let response = await createBrand(brand);

    if (response.status === 200) {
      router.replace(AUTHOR_URL);
    }
    handleCreatingResponse(response);
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-md-8">
          <h2>Create brand</h2>
          <form onSubmit={handleSubmit(handleSubmitBrand)}>
            <BrandGeneralInformation
              register={register}
              errors={errors}
              setValue={setValue}
              trigger={trigger}
            />
            <button className="btn btn-primary" type="submit">
              Save
            </button>
            <Link href="/catalog/brands">
              <button className="btn btn-primary" style={{ background: 'red', marginLeft: '30px' }}>
                Cancel
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default BrandCreate;
