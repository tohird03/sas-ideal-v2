import React from 'react';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IClientDeedAction, IClientDeedType} from '@/api/clients';
import { Tag } from 'antd';
import { ISingleProductStory } from '@/api/product/types';

export const singleProductColumns: ColumnsType<ISingleProductStory> = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '40px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'order',
    title: 'Sotuv',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#BFF5C0',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Mijoz',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.staff?.fullname,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Sotilgan vaqti',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BFF5C0',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
  {
    key: 'order',
    title: 'Tushurilgan mahsulotlar',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#BEE6FF',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Yetkazib beruvchi',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.staff?.fullname,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Olingan vaqti',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#BEE6FF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
  {
    key: 'order',
    title: 'Qaytgan mahsulotlar',
    align: 'center',
    width: '100px',
    onHeaderCell: () => ({
      style: {
        backgroundColor: '#FFBDBD',
        fontWeight: 'bold',
        textAlign: 'center',
      },
    }),
    children: [
      {
        title: 'Mijoz',
        key: 'client',
        dataIndex: 'client',
        width: 150,
        render: (value, record) => record?.staff?.fullname,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Mahsulot soni',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
      {
        title: 'Qaytarilgan vaqti',
        key: 'productCount',
        dataIndex: 'productCount',
        width: 100,
        render: (value, record) => record?.count,
        onHeaderCell: () => ({
          style: {
            backgroundColor: '#FFBDBD',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      },
    ],
  },
];

const clientDeedAction: Record<IClientDeedAction, string> = {
  [IClientDeedAction.SELLING]: 'Sotuv',
  [IClientDeedAction.RETURNING]: 'Qaytaruv',
  [IClientDeedAction.PAYMENT]: 'To\'lov',
};

const clientDeedActionColor: Record<IClientDeedAction, string> = {
  [IClientDeedAction.SELLING]: '#52c41a',
  [IClientDeedAction.RETURNING]: '#faad14',
  [IClientDeedAction.PAYMENT]: '#1890ff',
};
