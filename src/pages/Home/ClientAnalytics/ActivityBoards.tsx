import React from 'react';
import {DownOutlined} from '@ant-design/icons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {Button, Card, Table, Typography} from 'antd';
import {AxiosError} from 'axios';
import classNames from 'classnames/bind';
import {clientsInfoApi} from '@/api/clients';
import {ClientActivityBucket, IClientActivityRow} from '@/api/clients/types';
import {addNotification} from '@/utils';
import styles from './client-analytics.scss';
import {activityColumns} from './constants';

const cn = classNames.bind(styles);
const PAGE_SIZE = 20;

type BucketProps = {
  bucket: ClientActivityBucket;
  title: string;
  hint: string;
};

const ClientBucket = ({bucket, title, hint}: BucketProps) => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey: ['clientActivity', bucket],
    initialPageParam: 1,
    retry: false,
    queryFn: async ({pageParam}) => {
      try {
        const response = await clientsInfoApi.getClientActivity({
          bucket,
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
  const totalCount = data?.pages?.[0]?.totalCount || 0;

  return (
    <section>
      <div className={cn('client-analytics__bucket-head')}>
        <p className={cn('client-analytics__bucket-title')}>{title}</p>
        <span className={cn('client-analytics__bucket-count')}>{totalCount} ta</span>
      </div>
      <Typography.Text className={cn('client-analytics__bucket-hint')}>{hint}</Typography.Text>
      <Table<IClientActivityRow>
        rowKey="id"
        size="small"
        bordered
        columns={activityColumns}
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
            size="small"
            type="primary"
            icon={<DownOutlined />}
            loading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Yana 20 ta
          </Button>
        )}
      </div>
    </section>
  );
};

export const ActivityBoards = () => (
  <div className={cn('client-analytics__boards')}>
    <Card className={cn('client-analytics__board')} title="Faol">
      <div className={cn('client-analytics__periods')}>
        <ClientBucket
          bucket={ClientActivityBucket.Month1}
          title="1 oy"
          hint="Oxirgi 30 kun"
        />
        <ClientBucket
          bucket={ClientActivityBucket.Month2}
          title="2 oy"
          hint="30 kundan 60 kungacha"
        />
        <ClientBucket
          bucket={ClientActivityBucket.Month3}
          title="3 oy"
          hint="60 kundan 90 kungacha"
        />
      </div>
    </Card>
    <Card className={cn('client-analytics__board')} title="Faol emas">
      <ClientBucket
        bucket={ClientActivityBucket.Inactive}
        title="90 kundan ko‘p"
        hint="Oxirgi xarid 90 kundan eski"
      />
    </Card>
  </div>
);
