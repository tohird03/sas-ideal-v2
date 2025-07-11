import { TStage } from './types';
export const stage = process.env.REACT_APP_STAGE || 'dev';

export enum Endpoints {
  Base = '',

  // SETTINGS
  SignIn = '/auth/sign-in',
  UserProfile = '/auth/profile',

  // CLIENTS
  ClientsMany = '/client/many',
  ClientOne = '/client/one',

  // CLIENTS PAYMENTS
  ClientsPaymentsMany = '/client-payment/many',
  ClientsPaymentsOne = '/client-payment/one',

  SupplierMany = '/supplier/many',
  SupplierOne = '/supplier/one',

  SupplierPaymentsMany = '/supplier-payment/many',
  SupplierPaymentsOne = '/supplier-payment/one',

  ProductsMany = '/product/many',
  ProductsOne = '/product/one',

  StaffsMany = '/staff/many',
  StaffOne = '/staff/one',

  StaffPaymentsMany = '/staff-payment/many',
  StaffPaymentsOne = '/staff-payment/one',

  PermissionsMany = '/permission/many',

  SellingMany = '/selling/many',
  SellingOne = '/selling/one',
  AddEditProductToSelling = '/product-mv/selling/one',

  IncomeMany = '/arrival/many',
  IncomeOne = '/arrival/one',
  AddEditProductToArrival = '/product-mv/arrival/one',

  ReturnedOrderMany = '/returning/many',
  ReturnedOrderOne = '/returning/one',
  AddEditProductToReturning = '/product-mv/returning/one',
  ProductMv = '/product-mv/one',

  OrderStatistic = '/selling/total-stats',
  OrderGraphStatistic = '/selling/period-stats',

  OrderAllExcel = '/selling/excel-download/many',
  OrderOneExcel = '/selling/excel-download/one',
  IncomeOrderAllExcel = '/arrival/excel-download/many',
  IncomeOrderOneExcel = '/arrival/excel-download/one',
  ReturnedAllExcel = '/returning/excel-download/many',
  ReturnedOneExcel = '/returning/excel-download/one',
  ClientPaymentExcel = '/client-payment/excel-download/many',
  UploadClient = '/client/excel-download/many',
  UploadSupplier = '/supplier/excel-download/many',
  StaffPaymentExcel = '/staff-payment/excel-download/many',

  //XATO
  RefreshToken = '/dashboard-auth/refresh',

  // STAFFS
  Staffs = '/admin',
  StaffsPayments = '/employeePayment',

  // CLIENTS
  Users = '/user',
  Clients = '/user/client',
  ClientsDeed = '/user/client/deed',
  SupplierDeed = '/user/supplier/deed',
  Supplier = '/user/supplier',
  ClientDeedExcelUpload = '/user/client/deed/upload',
  SupplierDeedExcelUpload = '/user/supplier/deed/upload',

  // PRODUCTS
  products = '/product',
  productsIncomeOrder = '/incomingOrder',
  productsIncomeOrderProduct = '/incomingProduct',
  productsOrder = '/Order',
  productsOrderStatistic = '/Order/statistica',
  productsOrderProduct = '/orderProduct',
  productsOrderExel = '/Order/upload',
  productsIncomeOrderExel = '/incomingOrder/upload',
  productsReturnedOrderExel = '/returned-order/upload',

  // PAYMENT
  payment = '/client-payment/many',
  paymentUpload = '/payment/upload',
  incomePayment = '/incomingOrderPayment',

  // ROLES
  role = '/role',

  // RETURNED ORDER
  returnedOrder = '/returned-order',
  returnedProduct = '/returned-product',
}

const config: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://tmp.16.170.250.134.nip.io',
  },
  prod: {
    apiUrl: 'https://tmp.16.170.250.134.nip.io',
  },
};

const imgConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
  prod: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
};


export const umsStages = config[stage];
export const imgStages = imgConfig[stage];
