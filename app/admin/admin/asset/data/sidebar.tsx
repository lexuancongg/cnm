import {
  COUNTRY_URL,
  INVENTORY_WAREHOUSE_PRODUCTS_URL,
  INVENTORY_WAREHOUSE_STOCKS_URL,
  MANAGER_PROMOTIONS_URL,
  SALES_GIFT_CARDS_URL,
  SALES_ORDERS_URL,
  SALES_RECURRING_PAYMENTS_URL,
  SALES_RETURN_REQUESTS_URL,
  SALES_SHIPMENTS_URL,
  SALES_SHOPPING_CARTS_AND_WISHLISTS_URL,
  STATE_OR_PROVINCE_URL,
  SYSTEM_PAYMENT_PROVIDERS,
  SYSTEM_SETTINGS,
  TAX_CLASS_URL,
  TAX_RATE_URL,
  WAREHOUSE_URL,
  WEBHOOKS_URL,
} from '@constants/Common';

export const menu_catalog_item_data = [
  {
    id: 1,
    name: 'Author',
    link: '/catalog/authors',
  },
  {
    id: 2,
    name: 'Categories',
    link: '/catalog/categories',
  },
  {
    id: 3,
    name: 'Products',
    link: '/catalog/products',
  },
  
];

export const menu_customer_item_data = [
  {
    id: 1,
    name: 'Customers',
    link: '/customers',
  },
  {
    id: 2,
    name: 'Product Reviews',
    link: '/reviews',
  },
];

export const menu_location_item_data = [
  {
    id: 1,
    name: 'Countries',
    link: COUNTRY_URL,
  },
  {
    id: 2,
    name: 'Provinces',
    link: STATE_OR_PROVINCE_URL,
  },
];

export const menu_sale_item_data = [
  {
    id: 1,
    name: 'Orders',
    link: SALES_ORDERS_URL,
  },



];

