import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import slugify from 'slugify';

import CategoryImage from '@catalogComponents/CategoryImage';
import { Category } from '@catalogModels/Category';
import { createCategory, getCategories } from '@catalogServices/CategoryService';
import { CheckBox, Input, TextArea } from '@commonItems/Input';
import { handleCreatingResponse } from '@commonServices/ResponseStatusHandlingService';
import { CATEGORIES_URL } from 'constants/Common';

const CategoryCreate: NextPage = () => {
  const router = useRouter();
  const { handleSubmit, setValue, register } = useForm<Category>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
    });
  }, []);

  const onHandleSubmit: SubmitHandler<Category> = async (data: Category) => {
    const category: Category = {
      id: 0,
      name: data.name,
      slug: data.slug,
      description: data.description,
      isPublish: data.isPublish,
      imageId: data.imageId,
    };
    const response = await createCategory(category);

    if (response.status === 200) {
      router.replace(CATEGORIES_URL);
    }

    handleCreatingResponse(response);
  };



  return (
    <div className="row my-5">
      <div className="col-md-8">
        <h2 className="mb-3">Create category</h2>
        <form onSubmit={handleSubmit(onHandleSubmit)} name="form">
          <div className="mb-3">
            <Input
              labelText="Name"
              field="name"
              register={register}
              registerOptions={{
                required: { value: true, message: 'Category name is required' },
                onChange: (e) => {
                  setValue(
                    'slug',
                    slugify(e.target.value, {
                      lower: true,
                      strict: true,
                    })
                  );
                },
              }}
            />
          </div>
          <div className="mb-3">
            <Input
              labelText="Slug"
              field="slug"
              register={register}
              registerOptions={{
                required: { value: true, message: 'Slug is required' },
              }}
            />
          </div>
          <div className="mb-3">
            <TextArea labelText="Description" field="description" register={register} />
          </div>


          <CategoryImage setValue={setValue} id="category-image" image={null} />


          <button  className="btn btn-primary" type="submit">
            Save
          </button>
          &emsp;
          <Link href="/catalog/categories">
            <button className="btn btn-outline-secondary" type="button">
              Cancel
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreate;
