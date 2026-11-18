import React, {FC} from 'react';
import {observer} from 'mobx-react';
import {EditOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import {IProducts} from '@/api/product/types';
import {productsListStore} from '@/stores/products';

type Props = {
  product: IProducts;
};

export const Action: FC<Props> = observer(({product}) => {
  const handleEditProcess = () => {
    productsListStore.setSingleProduct(product);
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  return (
    <div style={{display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center'}}>
      <Button onClick={handleEditProcess} type="primary" icon={<EditOutlined />} />
    </div>
  );
});
