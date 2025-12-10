import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { productsListStore } from '@/stores/products';
import { Table } from 'antd';
import { singleProductColumns } from './constants';
import classNames from 'classnames/bind';
import { styles } from './single-product.scss';

const cn = classNames.bind(styles);

export const SingleProduct = observer(() => {
  const { productId } = useParams();

  useEffect(() => {
    if (productId) {
      productsListStore.getSingleProduct({
        productId,
      });
    }
  }, [productId]);

  return (
    <div>SingleProduct

      <Table
        columns={singleProductColumns}
        dataSource={productsListStore?.singleProductStory || []}
        bordered
        summary={(pageData) => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={1} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell
                colSpan={3}
                index={1}
                className={cn('total__order')}
              >
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  10
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={2}
                colSpan={3}
                className={cn('total__arrival')}
              >
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  10
                </div>
              </Table.Summary.Cell>
              <Table.Summary.Cell
                index={3}
                colSpan={3}
                className={cn('total__returning')}
              >
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  10
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={1} index={0}>
                Umumiy qoldiq
              </Table.Summary.Cell>
              <Table.Summary.Cell
                colSpan={9}
                index={2}
                className={cn('total')}
              >
                <div style={{ textAlign: 'center' }}>
                  1
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />

    </div>
  );
});
