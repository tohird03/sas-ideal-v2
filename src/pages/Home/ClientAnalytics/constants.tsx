import React from 'react';
import {NavLink} from 'react-router-dom';
import {ColumnsType} from 'antd/es/table';
import classNames from 'classnames/bind';
import dayjs from 'dayjs';
import {IClientActivityRow, IClientProfitRow} from '@/api/clients/types';
import {priceFormat} from '@/utils/priceFormat';
import styles from './client-analytics.scss';

const cn = classNames.bind(styles);

const highlight = {
  style: {
    backgroundColor: '#FFF1E6',
    fontWeight: 'bold',
    textAlign: 'center' as const,
  },
};

const countText = (value: number) => Number(value || 0).toLocaleString('ru-RU');

const clientPhone = (phone: string) => (phone?.startsWith('+') ? phone : `+${phone || ''}`);

const clientCell = (id: string, fullname: string, phone: string) => (
  <NavLink to={`/clients/single-client/${id}`} className={cn('client-analytics__client')}>
    <span className={cn('client-analytics__name')}>{fullname}</span>
    <span className={cn('client-analytics__phone')}>{clientPhone(phone)}</span>
  </NavLink>
);

export const activityColumns: ColumnsType<IClientActivityRow> = [
  {
    key: 'fullname',
    dataIndex: 'fullname',
    title: 'Mijoz',
    render: (value, record) => clientCell(record.id, record.fullname, record.phone),
  },
  {
    key: 'lastPurchaseDate',
    dataIndex: 'lastPurchaseDate',
    title: 'Oxirgi xarid',
    width: 118,
    align: 'center',
    render: (value: string) => dayjs(value).format('YYYY-MM-DD'),
  },
];

export const profitColumns = (): ColumnsType<IClientProfitRow> => [
  {
    key: 'index',
    title: '#',
    width: 70,
    align: 'center',
    render: (value, record, index) => {
      const rank = index + 1;

      if (rank > 3) {
        return rank;
      }

      return <span className={cn('client-analytics__rank', `client-analytics__rank--${rank}`)}>{rank}</span>;
    },
  },
  {
    key: 'fullname',
    dataIndex: 'fullname',
    title: 'Mijoz',
    render: (value, record) => clientCell(record.id, record.fullname, record.phone),
  },
  {
    key: 'saleCount',
    dataIndex: 'saleCount',
    title: 'Xaridlar soni',
    width: 140,
    align: 'center',
    render: (value: number) => countText(value),
  },
  {
    key: 'revenue',
    dataIndex: 'revenue',
    title: 'Sotuv summasi',
    width: 160,
    align: 'center',
    render: (value: number) => priceFormat(value),
  },
  {
    key: 'profit',
    dataIndex: 'profit',
    title: 'Foyda',
    width: 150,
    align: 'center',
    onHeaderCell: () => highlight,
    onCell: () => highlight,
    render: (value: number) => <b>{priceFormat(value)}</b>,
  },
];
