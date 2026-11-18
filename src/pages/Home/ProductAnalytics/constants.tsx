import React from 'react';
import {NavLink} from 'react-router-dom';
import {ColumnsType} from 'antd/es/table';
import classNames from 'classnames/bind';
import {IProductRankRow, ProductRankMetric} from '@/api/statistic/types';
import {priceFormat} from '@/utils/priceFormat';
import styles from './product-analytics.scss';

const cn = classNames.bind(styles);

const highlight = {
  style: {
    backgroundColor: '#FFF1E6',
    fontWeight: 'bold',
    textAlign: 'center' as const,
  },
};

const countText = (value: number) => Number(value || 0).toLocaleString('ru-RU');

export const rankColumns = (metric: ProductRankMetric): ColumnsType<IProductRankRow> => {
  const saleColumn = metric === ProductRankMetric.Count;
  const profitColumn = metric === ProductRankMetric.Profit;

  return [
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

        return <span className={cn('product-analytics__rank', `product-analytics__rank--${rank}`)}>{rank}</span>;
      },
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Mahsulot',
      render: (value, record) => <NavLink to={`/products/${record.id}`}>{record.name}</NavLink>,
    },
    {
      key: 'saleCount',
      dataIndex: 'saleCount',
      title: 'Sotuvlar soni',
      align: 'center',
      width: 140,
      onHeaderCell: () => saleColumn ? highlight : {},
      onCell: () => saleColumn ? highlight : {},
      render: (value: number) => saleColumn ? <b>{countText(value)}</b> : countText(value),
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Soni',
      align: 'center',
      width: 120,
      render: (value: number) => `${countText(value)} dona`,
    },
    {
      key: 'revenue',
      dataIndex: 'revenue',
      title: 'Sotuv summasi',
      align: 'center',
      width: 160,
      render: (value: number) => priceFormat(value),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Tannarx',
      align: 'center',
      width: 150,
      render: (value: number) => priceFormat(value),
    },
    {
      key: 'profit',
      dataIndex: 'profit',
      title: 'Foyda',
      align: 'center',
      width: 150,
      onHeaderCell: () => profitColumn ? highlight : {},
      onCell: () => profitColumn ? highlight : {},
      render: (value: number) => profitColumn ? <b>{priceFormat(value)}</b> : priceFormat(value),
    },
  ];
};
