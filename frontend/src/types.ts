export interface Product {
  SKU: string;
  Name: string;
  Price: number;
  Quantity: number;
  Barcode: string;
}

export interface SaleEntry {
  dateTime: string;
  SKU: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}
