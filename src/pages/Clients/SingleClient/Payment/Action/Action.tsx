import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {clientsPaymentApi} from '@/api/payment';
import {IClientsPayments} from '@/api/payment/types';
import {authStore} from '@/stores/auth';
import {singleClientStore} from '@/stores/clients';
import {addNotification} from '@/utils';
import {isShowEditPayments} from '@/utils/isShowEdit';

type Props = {
  clientPayment: IClientsPayments;
};

export const Action: FC<Props> = observer(({clientPayment}) => {
  const queryClient = useQueryClient();

  const {mutate: deletePayment} =
    useMutation({
      mutationKey: ['deletePayment'],
      mutationFn: (id: string) => clientsPaymentApi.deletePayment(id!),
      onSuccess: () => {
        addNotification('To\'lov o\'chirildi');
        queryClient.invalidateQueries({queryKey: ['getPayments']});
      },
      onError: addNotification,
    });

  const handleEditPayment = () => {
    singleClientStore.setSinglePayment(clientPayment);
    singleClientStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleDeletePayment = () => {
    deletePayment(clientPayment?.id);
  };

  const isShowEdit = isShowEditPayments(clientPayment?.createdAt, authStore.isCloseDay);

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {isShowEdit &&
        <>
          <Button onClick={handleEditPayment} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="To'lovni o'chirish"
            description="Rostdan ham bu to'lovni o'chirishni xohlaysizmi?"
            onConfirm={handleDeletePayment}
            okText="Ha"
            okButtonProps={{icon: <CheckOutlined />, style: {background: 'red'}}}
            cancelText="Yo'q"
            cancelButtonProps={{icon: <CloseOutlined />}}
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      }
    </div>
  );
});
