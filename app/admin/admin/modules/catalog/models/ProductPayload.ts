
import { FormProduct } from './FormProduct';


export type ProductPayload = {
  name?: string;
  slug?: string;
  brandId?: number;
  categoryIds?: number[];
  description?: string;
  specification?: string;
  price?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  thumbnailMediaId?: number;
  productImageIds?: number[];
};

export function mapFormProductToProductPayload(data: FormProduct): ProductPayload {
  return {
    name: data.name,
    slug: data.slug,
    brandId: data.brandId,
    categoryIds: data.categoryIds,
    description: data.description,
    specification: data.specification,
    price: data.price,
    isPublished: data.isPublished,
    isFeatured: data.isFeatured,
    thumbnailMediaId: data.thumbnailMedia?.id,
    productImageIds: data.productImageMedias?.map((image) => image.id),

  };
}
