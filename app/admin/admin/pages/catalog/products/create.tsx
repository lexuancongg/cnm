import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { handleCreatingResponse } from '../../../common/services/ResponseStatusHandlingService';
import { PRODUCT_URL } from '../../../constants/Common';
import {
  ProductImage,
  ProductGeneralInformation,
} from '../../../modules/catalog/components';
import { FormProduct } from '../../../modules/catalog/models/FormProduct';
import { mapFormProductToProductPayload } from '../../../modules/catalog/models/ProductPayload';
import { createProduct } from '../../../modules/catalog/services/ProductService';
import ProductCategoryMapping from '@catalogComponents/CategoryMapping';

const ProductCreate: NextPage = () => {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormProduct>({
    defaultValues: {
      isPublished: true,
    },
  });
  const [tabKey, setTabKey] = useState('general');

  const onSubmitForm: SubmitHandler<FormProduct> = async (data) => {
    try {
      const payload = mapFormProductToProductPayload(data);
      const productResponse = await createProduct(payload);

      if (productResponse.status === 200) {

        await router.push(PRODUCT_URL);
      }

      handleCreatingResponse(productResponse);
    } catch (error) {
      toast.error('Create product failed');
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length) {
      setTabKey('general');
      setTimeout(() => {
        document.getElementById(Object.keys(errors)[0])?.scrollIntoView();
      }, 0);
    }
  }, [errors]);

  return (
    <div className="create-product">
      <h2>Create Product</h2>

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Tabs className="mb-3" activeKey={tabKey} onSelect={(e: any) => setTabKey(e)}>
          <Tab eventKey={'general'} title="General Information">
            <ProductGeneralInformation
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </Tab>
          <Tab eventKey={'image'} title="Product Images">
            <ProductImage setValue={setValue} />
          </Tab>
          <Tab eventKey={'category'} title="Category Mapping">
            <ProductCategoryMapping setValue={setValue} getValue={getValues} />
          </Tab>




        </Tabs>
        <div className="text-center">
          <button className="btn btn-primary" type="submit">
            Create
          </button>
          <Link href="/catalog/products">
            <button className="btn btn-secondary m-3">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
