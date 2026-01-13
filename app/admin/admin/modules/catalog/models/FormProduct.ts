import { Media } from './Media';

export type FormProduct = {
  name?: string;
  slug?: string;
  brandId?: number;
  categoryIds?: number[];
  description?: string;
  shortDescription?: string;
  specification?: string;
  price?: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  thumbnailMedia?: Media;
  productImageMedias?: Media[];
};
