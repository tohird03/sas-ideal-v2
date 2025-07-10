import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddEditClientInfo,
  IClientsInfo,
  IGetClientDeedExcelParams,
  IGetClientsInfoParams,
  IGetSingleClientParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
    this.get(Endpoints.ClientsMany, { params });

  addClients = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.ClientOne, params);

  updateClient = (params: IAddEditClientInfo): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.ClientOne}`, params, { params: { id: params?.id } });

  deleteClient = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.ClientOne}`, { params: { id } });

  getSingleClient = (params: IGetSingleClientParams): Promise<{ data: IClientsInfo }> =>
    this.get(Endpoints.ClientOne, { params });

  getUploadClients = (params: IGetClientsInfoParams): Promise<any> =>
    this.get(Endpoints.UploadClient, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  //XATO
  deleteUser = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Users}/${id}`);

  getUploadDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.ClientDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadSupplierDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.SupplierDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const clientsInfoApi = new ClientsInfoApi(config);
