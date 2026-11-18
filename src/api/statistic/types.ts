export interface IOrderStatistic {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  client: IUserDebtStatistic;
  supplier: IUserDebtStatistic;

  weeklyChart: IOrderStatisticChart[];
}

export interface IUserDebtStatistic {
  ourDebt: number;
  theirDebt: number;
}

export interface IOrderStatisticChart {
  date: string;
  sum: number;
}

export interface IOrderGraphStatistic {
  sum: number;
  date: string;
}

export enum IOrderGraphStatisticType {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum ProductRankMetric {
  Count = 'count',
  Profit = 'profit',
}

export interface IProductRankSummary {
  productCount: number;
  quantity: number;
  revenue: number;
  profit: number;
}

export interface IProductRankRow {
  id: string;
  name: string;
  saleCount: number;
  quantity: number;
  revenue: number;
  cost: number;
  profit: number;
}

export interface IProductRankResponse {
  totalCount: number;
  pagesCount: number;
  pageSize: number;
  summary: IProductRankSummary;
  data: IProductRankRow[];
}

export interface IGetProductRankParams {
  metric: ProductRankMetric;
  startDate: Date;
  endDate: Date;
  pageNumber: number;
  pageSize: number;
}
