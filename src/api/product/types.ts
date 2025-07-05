import { IPagination } from "../types";

export interface IGetProductsParams extends IPagination {
  search?: string;
}


export interface IProducts {
  id: string;
  name: string;
  count: number;
  minAmount: number;
  createdAt: string;
  // Sotib olingan narx
  cost: number;
  // Sotuvda sotiladigan narxi
  price: number;
  lastSellingDate: string;
}

export interface IAddEditProduct {
  id?: string;
  min_amount?: number;
  wholesale_price?: number;
  name: string;
  count: number;
  cost: number;
  selling_price: number;
  unit: string;
}

export interface IProductTotalCalc {
  calcPage: {
    totalPrice: number,
    totalCost: number,
    totalCount: number,
  },
  calcTotal: {
    totalPrice: number,
    totalCost: number,
    totalCount: number,
  }
}
