import React, {FC, useState} from 'react';
import {observer} from 'mobx-react';
import {CheckOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm, Tooltip} from 'antd';
import {incomeProductsApi} from '@/api/income-products';
import {IIncomeOrder} from '@/api/income-products/types';
import {authStore} from '@/stores/auth';
import {incomeProductsStore} from '@/stores/products';
import {addNotification} from '@/utils';
import {getFullDateFormat} from '@/utils/getDateFormat';

type Props = {
  order: IIncomeOrder;
};

export const Action: FC<Props> = observer(({order}) => {
  const queryClient = useQueryClient();
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const {isCloseDay} = authStore;

  const today = new Date().toISOString().split('T')[0];
  const checkDate = order?.date?.split('T')[0]?.split(' ')[0];
  const isToday = checkDate === today && !isCloseDay;

  const {mutate: deleteIncomeProducts} =
    useMutation({
      mutationKey: ['deleteIncomeProducts'],
      mutationFn: (id: string) => incomeProductsApi.deleteIncomeOrder(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getIncomeOrders']});
      },
      onError: addNotification,
    });

  const handleShowOrder = () => {
    incomeProductsStore.setsingleIncomeOrder(order);
    incomeProductsStore.setIsOpenShowIncomeOrderModal(true);
  };

  const handleEditProcess = () => {
    incomeProductsStore.setsingleIncomeOrder(order);
    incomeProductsStore.setIncomeOrder(order);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(true);
  };

  const handleDelete = () => {
    deleteIncomeProducts(order?.id);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    incomeProductsApi.getUploadIncomeOrderToExel(order?.id)
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${order?.supplier?.fullname}, ${getFullDateFormat(order?.date)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Tooltip placement="top" title="Tushurilgan mahsulotni ko'rish">
        <Button onClick={handleShowOrder} icon={<EyeOutlined />} />
      </Tooltip>
      <Button
        onClick={handleDownloadExcel}
        icon={<DownloadOutlined />}
        loading={downloadLoading}
      />
      {isToday && (
        <>
          <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
            onConfirm={handleDelete}
            okText="Ha"
            okButtonProps={{icon: <CheckOutlined />, style: {background: 'red'}}}
            cancelText="Yo'q"
            cancelButtonProps={{icon: <CloseOutlined />}}
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )

      }
    </div>
  );
});
