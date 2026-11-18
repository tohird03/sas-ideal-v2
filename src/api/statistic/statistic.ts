import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {
  IGetProductRankParams,
  IOrderGraphStatistic,
  IOrderGraphStatisticType,
  IOrderStatistic,
  IProductRankResponse,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class StatisticApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrdersStatistic = (): Promise<{data: IOrderStatistic}> =>
    this.get(Endpoints.OrderStatistic);

  getOrdersGraphStatistic = (type: IOrderGraphStatisticType): Promise<{data: IOrderGraphStatistic[]}> =>
    this.get(Endpoints.OrderGraphStatistic, {params: {type}});

  getProductRank = (params: IGetProductRankParams): Promise<{data: IProductRankResponse}> =>
    this.get(Endpoints.ProductRank, {params});
}

export const statisticApi = new StatisticApi(config);
