import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import {CloseOutlined} from '@ant-design/icons';
import {Button, Modal, notification} from 'antd';
import classNames from 'classnames';
import {DataTable} from '@/components/Datatable/datatable';
import {incomeProductsStore} from '@/stores/products';
import {useMediaQuery} from '@/utils/mediaQuery';
import {ordersInfoColumns, ordersInfoPaymentColumns, ordersInfoProductsColumns} from '../constants';
import styles from '../income-products.scss';

const cn = classNames.bind(styles);

export const OrderShowInfoModal = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const handleModalClose = () => {
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIsOpenShowIncomeOrderModal(false);
  };

  useEffect(() => {
    if (!incomeProductsStore?.singleIncomeOrder) {
      notification.error({
        message: 'Bu tushum topilmadi!',
        placement: 'topRight',
      });
      handleModalClose();
    }
  }, [incomeProductsStore?.singleIncomeOrder]);

  return (
    <Modal
      open={incomeProductsStore.isOpenShowIncomeOrderModal}
      title={'Tushurilgan mahsulot'}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      cancelButtonProps={{icon: <CloseOutlined />}}
      centered
      style={{top: 0, padding: '20px'}}
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
          data={[incomeProductsStore?.singleIncomeOrder]}
          isMobile
          pagination={false}
        />
        <DataTable
          columns={ordersInfoPaymentColumns}
          data={[incomeProductsStore?.singleIncomeOrder]}
          isMobile
          pagination={false}
        />
      </div>
      <div>
        <DataTable
          columns={ordersInfoProductsColumns}
          data={incomeProductsStore?.singleIncomeOrder?.products || []}
          isMobile={isMobile}
          pagination={false}
        />
      </div>
    </Modal>
  );
});
