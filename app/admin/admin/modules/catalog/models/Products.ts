import { Product } from './Product';

export type Products = {
  productPreviewsPayload: Product[];
  pageIndex: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
};
