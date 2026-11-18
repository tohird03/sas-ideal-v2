import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {CloseOutlined} from '@ant-design/icons';
import {Button, Modal, notification, Table} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {ordersStore} from '@/stores/products';
import {ordersInfoColumns, ordersInfoPaymentColumns, ordersInfoProductsColumns} from '../constants';
import styles from '../orders.scss';

const cn = classNames.bind(styles);

export const OrderShowInfoModal = observer(() => {
  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setIsOpenShowOrderModal(false);
  };

  useEffect(() => {
    if (!ordersStore?.singleOrder) {
      notification.error({
        message: 'Bu sotuv topilmadi!',
        placement: 'topRight',
      });
      handleModalClose();
    }
  }, [ordersStore?.singleOrder]);

  return (
    <Modal
      open={ordersStore.isOpenShowOrderModal}
      title={'Sotuv'}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      cancelButtonProps={{icon: <CloseOutlined />}}
      centered
      style={{top: 0, padding: 0}}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <Button onClick={handleModalClose} icon={<CloseOutlined />}>
          Yopish
        </Button>
      }
    >
      <div className={cn('order__show-header')}>
        <DataTable
          columns={ordersInfoColumns}
          data={[ordersStore?.singleOrder]}
          isMobile
          pagination={false}
        />
        <DataTable
          columns={ordersInfoPaymentColumns}
          data={[ordersStore?.singleOrder]}
          isMobile
          pagination={false}
        />
      </div>
      <div>
        <Table
          columns={ordersInfoProductsColumns}
          dataSource={ordersStore?.singleOrder?.products || []}
          pagination={false}
        />
      </div>
    </Modal>
  );
});
