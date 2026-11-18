import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {incomePaymentApi} from '@/api/payment-income';
import {ISupplierPayments} from '@/api/payment-income/types';
import {authStore} from '@/stores/auth';
import {supplierPaymentsStore} from '@/stores/supplier';
import {addNotification} from '@/utils';
import {isShowEditPayments} from '@/utils/isShowEdit';

type Props = {
  supplierPayment: ISupplierPayments;
};

export const Action: FC<Props> = observer(({supplierPayment}) => {
  const queryClient = useQueryClient();

  const {mutate: deletePayment} =
    useMutation({
      mutationKey: ['deletePayment'],
      mutationFn: (id: string) => incomePaymentApi.deleteIncomePayment(id!),
      onSuccess: () => {
        addNotification('To\'lov o\'chirildi');
        queryClient.invalidateQueries({queryKey: ['getPayments']});
      },
      onError: addNotification,
    });

  const handleEditPayment = () => {
    supplierPaymentsStore.setSinglePayment(supplierPayment);
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleDeletePayment = () => {
    deletePayment(supplierPayment?.id);
  };

  const isShowEdit = isShowEditPayments(supplierPayment?.createdAt, authStore.isCloseDay);

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {isShowEdit && (
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
      )}
    </div>
  );
});
