import { IOrder } from '../order/types';
import { IReturnedOrder } from '../returned-order/types';
import {IPagination, IPayment} from '../types';

// CLIENT
export interface IClientsInfo {
  id: string;
  fullname: string;
  phone: string;
  debt: number;
  lastSellingDate: string;
}

export interface IUpdateUser {
  id: string;
  fullname: string;
  phone: string;
}

// THIS SELLER USER
export interface ISeller {
  id: string;
  fullname: string;
  phone: string;
}

export interface IGetClientsInfoParams extends IPagination {
  search?: string;
  debt?: number;
  debtType?: IClientDebtFilter;
}

export enum IClientDebtFilter {
  EQUAL = 'eq',
  GREATER = 'gt',
  LESS = 'lt',
}

export interface IAddEditClientInfo {
  id?: string;
  fullname: string;
  phone: string;
}

export interface IDeedPayment extends IPayment {
  type: 'payment';
  description: string;
}

export interface IDeedOrder extends IOrder {
  type: 'order';
  description: string;
  createdAt?: string;
}

export interface IDeedReturnedOrder extends IReturnedOrder {
  type: 'returned-order';
  description: string;
}

export type IDeed = IDeedPayment | IDeedOrder | IDeedReturnedOrder;
export type ISupplierDeed = IDeedPayment | IDeedOrder;

export interface IGetClientDeedParams {
  id: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IGeSupplierDeedParams {
  id: string;
  startDate?: string;
  endDate?: string;
}

export interface IGetClientDeedExcelParams {
  id: string;
  startDate?: Date;
  endDate?: Date;
  type: 'deed' | 'product';
}
