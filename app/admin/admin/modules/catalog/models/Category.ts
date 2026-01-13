export type Category = {
  id: number;
  name: string;
  description: string;
  slug: string;
  imageId?: number;
  imageCategory?: {
    id: number;
    url: string;
  };
};
