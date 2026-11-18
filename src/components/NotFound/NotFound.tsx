import React from 'react';
import {StopOutlined} from '@ant-design/icons';
import {Result} from 'antd';
import classNames from 'classnames/bind';
import styles from './not-found.scss';

const cn = classNames.bind(styles);

export const NotFound = () => (
  <div className={cn('not-found')}>
    <Result
      title="Ma'lumot yo'q"
      subTitle="Bu yerda ma'lumot mavjud emas"
      icon={<StopOutlined />}
    />
  </div>
);
