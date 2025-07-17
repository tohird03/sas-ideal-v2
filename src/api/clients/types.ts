import { IOrder } from '../order/types';
import { IReturnedOrder } from '../returned-order/types';
import { IPagination, IPayment } from '../types';

// CLIENT
export interface IClientsInfo {
  id: string;
  fullname: string;
  phone: string;
  debt: number;
  lastSellingDate: string;
  deedInfo: IClientDeedInfo;
  telegram?: {
    isActive: boolean;
  };
}

export interface IGetSingleClientParams {
  deedStartDate?: Date;
  deedEndDate?: Date;
  id: string;
}

export interface IClientDeedInfo {
  totalDebit: number;
  totalCredit: number;
  debt: number;
  deeds: IClientDeed[];
}

export interface IClientDeed {
  type: IClientDeedType;
  value: number;
  date: string;
  description: string;
  action: IClientDeedAction;
}

export enum IClientDeedType {
  DEBIT = 'debit',
  KREDIT = 'credit',
}

export enum IClientDeedAction {
  SELLING = 'selling',
  RETURNING = 'returning',
  PAYMENT = 'payment',
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

export interface IGetClientDeedExcelParams {
  id: string;
  startDate?: Date;
  endDate?: Date;
  type: 'deed' | 'product';
}
