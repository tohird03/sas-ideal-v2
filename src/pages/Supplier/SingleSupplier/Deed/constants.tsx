import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ArrowRightOutlined } from '@ant-design/icons';
import { ISupplierDeed, ISupplierDeedType } from '@/api/supplier/types';

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
    width: '250px',
    // render: (value, record) => (
    //   <>
    //     {record?.type === 'order' ? 'Tushirish' : 'Qarzga to\'lov'}
    //     {<ArrowRightOutlined />}
    //     <p
    //       style={{ margin: 0, color: 'blue', display: 'inline' }}
    //     >
    //       №: {record?.type === 'order' ? record?.articl : record?.id}
    //     </p>
    //   </>
    // ),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Дебит',
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
    title: 'Кредит',
    align: 'center',
    width: '50px',
    className: 'red-col',
    render: (value, record) => (
      record?.type === ISupplierDeedType.KREDIT
        ? priceFormat(record?.value)
        : null
    ),
  },
];
