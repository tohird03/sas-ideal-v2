import React from 'react';
import {Tag} from 'antd';
import {ColumnType} from 'antd/es/table';
import {ISupplierDeed, ISupplierDeedAction, ISupplierDeedType} from '@/api/supplier/types';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {priceFormat} from '@/utils/priceFormat';

export const deedColumns: ColumnType<ISupplierDeed>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '40px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Vaqti',
    align: 'center',
    width: '100px',
    render: (value, record) => getFullDateFormat(record?.date),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    width: '50px',
    render: (value, record) => <Tag color={supplierDeedActionColor[record?.action]}>{supplierDeedAction[record?.action]}</Tag>,
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Debet',
    align: 'center',
    width: '50px',
    className: 'green-col',
    render: (value, record) => (
      record?.type === ISupplierDeedType.DEBIT
        ? priceFormat(record?.value)
        : null
    ),
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Kredit',
    align: 'center',
    width: '50px',
    className: 'red-col',
    render: (value, record) => (
      record?.type === ISupplierDeedType.KREDIT
        ? priceFormat(record?.value)
        : null
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: '200px',
    render: (value, record) => <span>{record?.description}</span>,
  },
];

const supplierDeedAction: Record<ISupplierDeedAction, string> = {
  [ISupplierDeedAction.PAYMENT]: 'To\'lov',
  [ISupplierDeedAction.ARRIVAL]: 'Tushum',
};

const supplierDeedActionColor: Record<ISupplierDeedAction, string> = {
  [ISupplierDeedAction.PAYMENT]: '#1890ff',
  [ISupplierDeedAction.ARRIVAL]: '#13c2c2',
};
