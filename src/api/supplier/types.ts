import { IPagination } from "../types";

export interface IGetSupplierInfoParams extends IPagination {
  search?: string;
  debt?: number;
  debtType?: ISupplierDebtFilter;
}

export enum ISupplierDebtFilter {
  EQUAL = 'eq',
  GREATER = 'gt',
  LESS = 'lt',
}

export interface ISupplierInfo {
  id: string;
  fullname: string;
  phone: string;
  debt: number;
  lastArrivalDate: string;
}

export interface IAddEditSupplier {
  id?: string;
  fullname: string;
  phone: string;
}
