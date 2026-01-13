export type OrderAddress = {
  id?: number;
  contactName: string;
  phoneNumber: string;
  specificAddress?: string;
  districtId: number;
  districtName?: string;
  provinceNameId: number;
  provinceName?: string;
  countryId: number;
  countryName?: string;
  isActive?: boolean;
};
