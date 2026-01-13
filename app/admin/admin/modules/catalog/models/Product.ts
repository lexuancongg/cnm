import { Category } from './Category';
import { Media } from './Media';

export type Product = {
  id: number;
  slug:string
  name: string;
  description: string;
  specification: string;
  price: number;
  isPublished: boolean;
  isFeatured: boolean;
  brandId: number;
  categories: Category[];
  thumbnailMedia: Media;
  productImageMedias: Media[];
  avatarUrl:string
  createdOn: Date;
};
