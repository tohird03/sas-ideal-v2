import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IGetSupplierInfoParams, ISupplierInfo } from '../clients';
import { IAddEditSupplier } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class SupplierInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getSuppliersInfo = (params: IGetSupplierInfoParams): Promise<IResponse<ISupplierInfo[]>> =>
    this.get(Endpoints.SupplierMany, { params });

  addSuppliers = (params: IAddEditSupplier): Promise<AxiosResponse> =>
    this.post(Endpoints.SupplierOne, params);

  updateSupplier = (params: IAddEditSupplier): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.SupplierOne}`, params, { params: { id: params?.id } });

  deleteSupplier = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.SupplierOne}`, {params: {id}});
}

export const supplierInfoApi = new SupplierInfoApi(config);
