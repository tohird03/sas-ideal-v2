import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IGetProductsParams, IGetSingleProductParams, IProducts, ISingleProductStory } from '@/api/product/types';
import { productsApi } from '@/api/product/product';

class ProductsListStore {
  pageNumber = 1;
  pageSize = 100;
  search: string | null = null;
  isOpenAddEditProductModal = false;
  singleProduct: IProducts | null = null;
  singleProductStory: ISingleProductStory[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getProducts = (params: IGetProductsParams) =>
    productsApi.getProducts(params)
      .then(res => res)
      .catch(addNotification);

  getSingleProduct = (params: IGetSingleProductParams) =>
    productsApi.getSingleProduct(params)
      .then(res => {
        console.log(res?.data);

        this.setSingleProductStory(res?.data?.products);
      })
      .catch(addNotification);

  setSingleProductStory = (singleProductStory: ISingleProductStory[]) => {
    this.singleProductStory = singleProductStory;
  };

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditProductModal = (isOpenAddEditProductModal: boolean) => {
    this.isOpenAddEditProductModal = isOpenAddEditProductModal;
  };

  setSingleProduct = (singleProduct: IProducts | null) => {
    this.singleProduct = singleProduct;
  };

  reset() {
    this.pageNumber = 1;
    this.pageSize = 100;
    this.search = null;
  }
}

export const productsListStore = new ProductsListStore();
