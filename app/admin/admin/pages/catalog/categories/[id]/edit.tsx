import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Category } from '../../../../modules/catalog/models/Category';
import {
  getCategories,
  getCategory,
  updateCategory,
} from '../../../../modules/catalog/services/CategoryService';
import { CATEGORIES_URL, ResponseStatus } from '../../../../constants/Common';
import { handleUpdatingResponse } from '../../../../common/services/ResponseStatusHandlingService';
import { useForm } from 'react-hook-form';
import { uploadMedia } from '../../../../modules/catalog/services/MediaService';
import { toast } from 'react-toastify';
import { isValidFile, validTypes } from '../../../../modules/catalog/components/ChooseThumbnail';
import ChooseImageCommon from '../../../../common/components/ChooseImageCommon';
import styles from '../../../../styles/ChooseImage.module.css';

type Image = {
  id: number;
  url: string;
};

const CategoryEdit: NextPage = () => {
  const router = useRouter();
  const { setValue, handleSubmit } = useForm<Category>();
  const { id } = router.query;
  var slugify = require('slugify');
  const [category, setCategory] = useState<Category>();
  const [slug, setSlug] = useState<string>();
  const [imageId, setImageId] = useState<number>();
  const [categoryImage, setCategoryImage] = useState<Image | null>();

  const handleSubmitEdit = async (data: any, event: any) => {
    event.preventDefault();
    let category: Category = {
      id: 0,
      name: event.target.name.value,
      slug: event.target.slug.value,
      description: event.target.description.value,
      imageId,
    };

    if (id) {
      const response = await updateCategory(+id, category);
      if (response.status === ResponseStatus.SUCCESS) {
        router.replace(CATEGORIES_URL);
      }
      handleUpdatingResponse(response);
    }
  };






  useEffect(() => {
    if (id)
      getCategory(+id).then((data) => {
        setCategory(data);
        setSlug(data.slug);
        if (data.imageCategory) {
          setImageId(data.imageCategory.id);
          setCategoryImage(data.imageCategory);
        }
      });
  }, [id]);


  const onChangeProductImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) {
      return;
    }

    const fileList = event.target.files;
    const isAllValidImage =
      fileList && Array.from(fileList).every((file) => isValidFile(file, validTypes));

    if (!isAllValidImage) {
      toast.error('Please select an image file (jpg or png)');
      return;
    }
    try {
      const file = fileList[0];
      const res = await uploadMedia(file);
      const url = URL.createObjectURL(file);
      setValue?.('imageId', res.id);
      setImageId(res.id);
      setCategoryImage({
        id: res.id,
        url,
      });
    } catch (e) {
      toast.error('Upload image failed');
    }
  };

  const onDeleteImage = () => {
    setCategoryImage(null);
    setImageId(undefined);
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-md-8">
          <form onSubmit={handleSubmit(handleSubmitEdit)} name="form">
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                className="form-control"
                type="text"
                id="name"
                name="name"
                defaultValue={category?.name}
                required
                onChange={(e) => {
                  let generate = slugify(e.target.value, {
                    lower: true,
                    strict: true,
                  });
                  setSlug(generate);
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="slug">
                Slug
              </label>
              <input
                className="form-control"
                type="text"
                id="slug"
                name="slug"
                defaultValue={slug}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                defaultValue={category?.description}
                name="description"
              />
            </div>
            {!categoryImage && (
              <div className="mb-3">
                <label className={styles['image-label']} htmlFor="category-image">
                  Choose category image
                </label>
              </div>
            )}
            <input
              hidden
              type="file"
              multiple
              id="category-image"
              onChange={(event) => onChangeProductImage(event)}
            />
            {categoryImage && (
              <div className="mb-3">
                <ChooseImageCommon
                  id="category-image"
                  url={categoryImage.url}
                  onDeleteImage={onDeleteImage}
                />
              </div>
            )}
            <button className="btn btn-primary" type="submit">
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
    </>
  );
};
export default CategoryEdit;
