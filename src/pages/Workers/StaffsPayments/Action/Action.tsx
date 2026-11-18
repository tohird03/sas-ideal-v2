import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Button, Popconfirm} from 'antd';
import {staffsPaymentsApi} from '@/api/staffs-payments/staffs-payments';
import {IStaffsPayments} from '@/api/staffs-payments/types';
import {staffsPaymentStore} from '@/stores/workers/staffs-payments';
import {addNotification} from '@/utils';

type Props = {
  staffsPayment: IStaffsPayments;
};

export const Action: FC<Props> = observer(({staffsPayment}) => {
  const queryClient = useQueryClient();

  const {mutate: deleteStaffsPayment} =
    useMutation({
      mutationKey: ['deleteStaffsPayment'],
      mutationFn: (id: string) => staffsPaymentsApi.deleteStaffPayment(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getStaffsPayments']});
      },
      onError: addNotification,
    });

  const handleEditStaffsPayments = () => {
    staffsPaymentStore.setSingleStaffPayments(staffsPayment);
    staffsPaymentStore.setIsOpenAddEditStaffPaymentsModal(true);
  };

  const handleDelete = () => {
    deleteStaffsPayment(staffsPayment?.id);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      {/* {authStore?.staffInfo?.role === 'super_admin' && ( */}
      <>
        <Button onClick={handleEditStaffsPayments} type="primary" icon={<EditOutlined />} />
        <Popconfirm
          title="Xodim hisobotini o'chirish"
          description="Rostdan ham xodimni bu hisobotini o'chirishni xohlaysizmi?"
          onConfirm={handleDelete}
          okText="Ha"
          okButtonProps={{icon: <CheckOutlined />, style: {background: 'red'}}}
          cancelText="Yo'q"
          cancelButtonProps={{icon: <CloseOutlined />}}
        >
          <Button type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      </>
    </div>
  );
});
