import {authStore} from './auth';
import {clientsInfoStore, paymentsStore, singleClientStore} from './clients';
import {incomeProductsStore, ordersStore, productsListStore, returnedOrdersStore} from './products';
import {profileStore} from './profile';
import {singleSupplierStore, supplierInfoStore, supplierPaymentsStore} from './supplier';
import {staffsStore} from './workers';

export const stores = {
  authStore,
  profileStore,
  staffsStore,
  clientsInfoStore,
  paymentsStore,
  singleClientStore,
  supplierInfoStore,
  supplierPaymentsStore,
  singleSupplierStore,
  productsListStore,
  incomeProductsStore,
  ordersStore,
  returnedOrdersStore,
};

export const resetStores = () => {
  authStore.reset();
  profileStore.reset();
  staffsStore.reset();
  clientsInfoStore.reset();
  paymentsStore.reset();
  singleClientStore.reset();
  supplierInfoStore.reset();
  supplierPaymentsStore.reset();
  singleSupplierStore.reset();
  productsListStore.reset();
  incomeProductsStore.reset();
  ordersStore.reset();
  returnedOrdersStore.reset();
};
