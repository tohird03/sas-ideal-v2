import { IOrderStatus } from '@/api/order/types';

export const isShowEdit = (status: IOrderStatus, createdAt: string): boolean => {
  if (!status || !createdAt) return false;

  const today = new Date().toISOString().split('T')[0];
  const orderDate = createdAt.split('T')[0]?.split(' ')[0];

  const isToday = today === orderDate;

  return isToday || status === IOrderStatus.NOTACCEPTED;
};
