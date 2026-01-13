import { useEffect, useState } from 'react';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';

import { Category } from '@catalogModels/Category';
import { FormProduct } from '@catalogModels/FormProduct';
import { Product } from '@catalogModels/Product';
import { getCategories } from '@catalogServices/CategoryService';

type Props = {
  product?: Product;
  setValue: UseFormSetValue<FormProduct>;
  getValue: UseFormGetValues<FormProduct>;
};

const ProductCategoryMapping = ({ product, setValue }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [checkCategory, setCheckCategory] = useState<string[]>([]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      if (product?.categories && checkCategory.length === 0) {
        const initialChecked = product.categories.map((item: any) => item.id.toString());
        setCheckCategory(initialChecked);
        setValue('categoryIds', product.categories.map((cat: any) => cat.id));
      }
    });
  }, [product, setValue, checkCategory.length]);

  const checkedTrue = (id: number): boolean => {
    return checkCategory.includes(id.toString());
  };

  const onSaveUpdateCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    let updatedCheckCategory: string[];
    if (isChecked) {
      updatedCheckCategory = [...checkCategory, value];
    } else {
      updatedCheckCategory = checkCategory.filter((item) => item !== value);
    }

    updatedCheckCategory = Array.from(new Set(updatedCheckCategory));
    setCheckCategory(updatedCheckCategory);

    // Update form value
    const categoryIds = updatedCheckCategory.map(Number);
    setValue('categoryIds', categoryIds.length > 0 ? categoryIds : []);
  };

  return (
    <div className="choice-category">
      <ul style={{ listStyleType: 'none' }}>
        {categories.map((category) => (
          <li key={category.id}>
            <input
              value={category.id || ''}
              type="checkbox"
              name="category"
              checked={checkedTrue(category.id)}
              id={`checkbox-${category.id}`}
              onChange={onSaveUpdateCategory}
            />
            <label
              htmlFor={`checkbox-${category.id}`}
              style={{
                paddingLeft: '15px',
                fontSize: '1rem',
                paddingTop: '10px',
                paddingBottom: '5px',
              }}
            >
              {category.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductCategoryMapping;