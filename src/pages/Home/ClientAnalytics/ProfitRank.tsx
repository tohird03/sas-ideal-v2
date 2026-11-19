import React, {useMemo, useState} from 'react';
import CountUp from 'react-countup';
import {DollarOutlined, DownOutlined, ShoppingOutlined, TeamOutlined} from '@ant-design/icons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Button, Card, DatePicker, Table, Typography} from 'antd';
import {AxiosError} from 'axios';
import classNames from 'classnames/bind';
import dayjs, {Dayjs} from 'dayjs';
import {clientsInfoApi} from '@/api/clients';
import {IClientProfitRow} from '@/api/clients/types';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import styles from './client-analytics.scss';
import {profitColumns} from './constants';

const cn = classNames.bind(styles);
const PAGE_SIZE = 20;

const money = (value: number) => <CountUp duration={1.2} end={Number(value) || 0} separator=" " decimals={0} />;

export const ProfitRank = () => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().endOf('day'));
  const columns = useMemo(() => profitColumns(), []);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['clientProfitRank', startDate.toISOString(), endDate.toISOString()],
    initialPageParam: 1,
    retry: false,
    queryFn: async ({pageParam}) => {
      try {
        const response = await clientsInfoApi.getClientProfitRank({
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
    <>
      <div className={cn('client-analytics__head')}>
        <div className={cn('client-analytics__filter')}>
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

      <div className={cn('client-analytics__cards')}>
        <Card className={cn('client-analytics__card')}>
          <TeamOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('client-analytics__card-label')}>Mijozlar</p>
          <p className={cn('client-analytics__card-value')}>{money(summary?.clientCount || 0)}</p>
        </Card>
        <Card className={cn('client-analytics__card')}>
          <ShoppingOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('client-analytics__card-label')}>Xaridlar</p>
          <p className={cn('client-analytics__card-value')}>{money(summary?.saleCount || 0)}</p>
        </Card>
        <Card className={cn('client-analytics__card')}>
          <DollarOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('client-analytics__card-label')}>Sotuv summasi</p>
          <p className={cn('client-analytics__card-value')}>{priceFormat(summary?.revenue || 0)}</p>
        </Card>
        <Card className={cn('client-analytics__card')}>
          <DollarOutlined style={{fontSize: 28, color: '#f18024'}} />
          <p className={cn('client-analytics__card-label')}>Sof foyda</p>
          <p className={cn('client-analytics__card-value')}>{priceFormat(summary?.profit || 0)}</p>
        </Card>
      </div>

      <Table<IClientProfitRow>
        rowKey="id"
        bordered
        columns={columns}
        dataSource={rows}
        loading={isLoading}
        pagination={false}
        locale={{emptyText: isError ? 'Ma’lumot yuklanmadi' : 'Mijoz yo‘q'}}
      />

      <div className={cn('client-analytics__more')}>
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
    </>
  );
};
