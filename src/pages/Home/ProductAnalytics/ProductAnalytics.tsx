import React, {useMemo, useState} from 'react';
import CountUp from 'react-countup';
import {
  CalendarOutlined,
  DollarOutlined,
  DownOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Button, Card, DatePicker, Table, Tabs, Typography} from 'antd';
import {AxiosError} from 'axios';
import classNames from 'classnames/bind';
import dayjs, {Dayjs} from 'dayjs';
import {statisticApi} from '@/api/statistic/statistic';
import {IProductRankRow, ProductRankMetric} from '@/api/statistic/types';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {rankColumns} from './constants';
import styles from './product-analytics.scss';

const cn = classNames.bind(styles);
const PAGE_SIZE = 20;

const money = (value: number) => <CountUp duration={1.2} end={Number(value) || 0} separator=" " decimals={0} />;

export const ProductAnalytics = () => {
  const [metric, setMetric] = useState<ProductRankMetric>(ProductRankMetric.Count);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().endOf('day'));

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['productRank', metric, startDate.toISOString(), endDate.toISOString()],
    initialPageParam: 1,
    retry: false,
    queryFn: async ({pageParam}) => {
      try {
        const response = await statisticApi.getProductRank({
          metric,
          startDate: startDate.startOf('day').toDate(),
          endDate: endDate.endOf('day').toDate(),
          pageNumber: pageParam,
          pageSize: PAGE_SIZE,
        });

        return response.data;
      } catch (error) {
        addNotification(error as AxiosError);
        throw error;
      }
    },
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const loaded = pages.reduce((count, page) => count + page.data.length, 0);

      if (!lastPage.totalCount || loaded >= lastPage.totalCount) {
        return undefined;
      }

      return lastPageParam + 1;
    },
  });

  const rows = (data?.pages || []).flatMap((page) => page.data);
  const summary = data?.pages?.[0]?.summary;
  const totalCount = data?.pages?.[0]?.totalCount || 0;
  const columns = useMemo(() => rankColumns(metric), [metric]);

  const handleStartChange = (date: Dayjs | null) => {
    if (!date) {
      return;
    }

    const nextStart = date.startOf('day');

    setStartDate(nextStart);
    if (nextStart.isAfter(endDate)) {
      setEndDate(nextStart.endOf('day'));
    }
  };

  const handleEndChange = (date: Dayjs | null) => {
    if (!date) {
      return;
    }

    const nextEnd = date.endOf('day');

    setEndDate(nextEnd);
    if (nextEnd.isBefore(startDate)) {
      setStartDate(nextEnd.startOf('day'));
    }
  };

  return (
    <main>
      <div className={cn('product-analytics__head')}>
        <Typography.Title level={3}>Mahsulotlar tahlili</Typography.Title>
        <div className={cn('product-analytics__filter')}>
          <DatePicker
            value={startDate}
            allowClear={false}
            placeholder="Boshlanish sanasi"
            onChange={handleStartChange}
          />
          <DatePicker
            value={endDate}
            allowClear={false}
            placeholder="Tugash sanasi"
            onChange={handleEndChange}
          />
        </div>
      </div>

      <div className={cn('product-analytics__cards')}>
        <Card className={cn('product-analytics__card')}>
          <ShoppingOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('product-analytics__card-label')}>Sotilgan mahsulot</p>
          <p className={cn('product-analytics__card-value')}>{money(summary?.productCount || 0)}</p>
        </Card>
        <Card className={cn('product-analytics__card')}>
          <CalendarOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('product-analytics__card-label')}>Jami dona</p>
          <p className={cn('product-analytics__card-value')}>{money(summary?.quantity || 0)}</p>
        </Card>
        <Card className={cn('product-analytics__card')}>
          <DollarOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('product-analytics__card-label')}>Sotuv summasi</p>
          <p className={cn('product-analytics__card-value')}>{priceFormat(summary?.revenue || 0)}</p>
        </Card>
        <Card className={cn('product-analytics__card')}>
          <DollarOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('product-analytics__card-label')}>Sof foyda</p>
          <p className={cn('product-analytics__card-value')}>{priceFormat(summary?.profit || 0)}</p>
        </Card>
      </div>

      <Tabs
        activeKey={metric}
        onChange={(key) => setMetric(key as ProductRankMetric)}
        items={[
          {key: ProductRankMetric.Count, label: 'Eng ko‘p sotilgan'},
          {key: ProductRankMetric.Profit, label: 'Eng ko‘p foyda'},
        ]}
      />

      <Table<IProductRankRow>
        rowKey="id"
        bordered
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        pagination={false}
        locale={{emptyText: isError ? 'Ma’lumot yuklanmadi' : 'Ma’lumot yo‘q'}}
      />

      <div className={cn('product-analytics__more')}>
        <Typography.Text type="secondary">
          Ko‘rsatilgan: {rows.length} / {totalCount}
        </Typography.Text>
        {hasNextPage && (
          <Button
            type="primary"
            icon={<DownOutlined />}
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Yana 20 ta
          </Button>
        )}
      </div>
    </main>
  );
};
