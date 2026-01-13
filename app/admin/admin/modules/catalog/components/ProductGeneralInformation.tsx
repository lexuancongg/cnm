import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FieldErrorsImpl, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import slugify from 'slugify';

import { CheckBox, Input, NumberFormatInput, Select, TextArea } from '../../../common/items/Input';
import { OptionSelect } from '../../../common/items/OptionSelect';
import TextEditor from '../../../common/items/TextEditor';
import { AuthorVm } from '../models/Brand';
import { FormProduct } from '../models/FormProduct';
import { Product } from '../models/Product';
import { getBrands } from '../services/BrandService';
import { getProduct } from '../services/ProductService';

type Props = {
  register: UseFormRegister<FormProduct>;
  errors: FieldErrorsImpl<FormProduct>;
  setValue: UseFormSetValue<FormProduct>;
  watch: UseFormWatch<FormProduct>;
};

const ProductGeneralInformation = ({ register, errors, setValue, watch }: Props) => {
  const router = useRouter();
  const { id } = router.query;

  const [brands, setBrands] = useState<AuthorVm[]>([]);

  const [product, setProduct] = useState<Product>();
  const [isLoading, setLoading] = useState(false);


  useEffect(() => {
    getBrands().then((data) => {
      setBrands(data);
    });
   
  }, []);

  useEffect(() => {
    // In case of updating we load product base on id
    if (id) {
      setLoading(true);
      getProduct(+id)
        .then((data) => {
          setProduct(data);
          setValue('description', data.description ?? '');
          setValue('specification', data.specification ?? '');
          setValue('price', data.price ?? 0, { shouldValidate: true, shouldDirty: true });
          setLoading(false);
        })
        .catch((error) => {
          toast('Load product failed. Please check the error log');
          location.replace('/catalog/products');
        });
    }
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (id && !product) return <p>No product</p>;
  return (
    <>
      <Input
        labelText="Product name"
        field="name"
        defaultValue={product?.name}
        register={register}
        registerOptions={{
          required: { value: true, message: 'Product name is required' },
          onChange: (event) =>
            setValue('slug', slugify(event.target.value, { lower: true, strict: true })),
        }}
        error={errors.name?.message}
      />
      <Input
        labelText="Slug"
        field="slug"
        defaultValue={product?.slug}
        register={register}
        error={errors.slug?.message}
      />
      
      <TextEditor
        labelText="Description"
        field="description"
        defaultValue={product?.description}
        error={errors.description?.message}
        setValue={(value) => {
          setValue('description', value);
        }}
      />

      <TextEditor
        labelText="Specification"
        field="specification"
        defaultValue={product?.specification}
        error={errors.specification?.message}
        setValue={(value) => {
          setValue('specification', value);
        }}
      />
      <NumberFormatInput
        labelText="Price"
        field="price"
        defaultValue={product?.price}
        register={register}
        setValue={setValue}
        error={errors.price?.message}
        type="number"
        registerOptions={{
          required: { value: true, message: 'Product price is required' },
          validate: { positive: (v) => v > 0 || 'Price must be greater than 0' },
        }}
      />


      


      

      <OptionSelect
        labelText="Brand"
        field="brandId"
        placeholder="Select brand"
        options={brands}
        register={register}
        registerOptions={{ required: { value: true, message: 'Please select brand' } }}
        error={errors.brandId?.message}
        defaultValue={product?.brandId}
      />

     
    </>
  );
};

export default ProductGeneralInformation;
