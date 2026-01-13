import { FieldErrorsImpl, UseFormRegister, UseFormSetValue, UseFormTrigger } from 'react-hook-form';
import slugify from 'slugify';

import { Input, Switch } from '../../../common/items/Input';
import { SLUG_FIELD_PATTERN } from '../constants/validationPattern';
import { AuthorVm } from '../models/Brand';

type Props = {
  register: UseFormRegister<AuthorVm>;
  errors: FieldErrorsImpl<AuthorVm>;
  setValue: UseFormSetValue<AuthorVm>;
  trigger: UseFormTrigger<AuthorVm>;
  brand?: AuthorVm;
};

const BrandGeneralInformation = ({ register, errors, setValue, trigger, brand }: Props) => {
  const onNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await trigger('name');
  };
  return (
    <>
      <Input
        labelText="Name"
        field="name"
        defaultValue={brand?.name}
        register={register}
        registerOptions={{
          required: { value: true, message: 'Brand name is required' },
          onChange: onNameChange,
        }}
        error={errors.name?.message}
      />
    {/*  <Input*/}
    {/*    labelText="Slug"*/}
    {/*    field="slug"*/}
    {/*    defaultValue={brand?.slug}*/}
    {/*    register={register}*/}
    {/*    registerOptions={{*/}
    {/*      required: { value: true, message: 'Slug brand is required' },*/}
    {/*      pattern: {*/}
    {/*        value: SLUG_FIELD_PATTERN,*/}
    {/*        message:*/}
    {/*          'Slug must not contain special characters except dash and all characters must be lowercase',*/}
    {/*      },*/}
    {/*    }}*/}
    {/*    error={errors.slug?.message}*/}
    {/*  />*/}
    {/*  <Switch*/}
    {/*    labelText="Publish"*/}
    {/*    field="isPublish"*/}
    {/*    defaultChecked={brand?.isPublish}*/}
    {/*    register={register}*/}
    {/*  />*/}
    </>
  );
};

export default BrandGeneralInformation;
