import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Segmented, Typography} from 'antd';
import {SegmentedValue} from 'antd/es/segmented';
import classNames from 'classnames';
import {ISingleClientTabs, singleClientStore} from '@/stores/clients/single-client';
import {SegmentComponents, singleClientTabOptions} from './constants';
import styles from './single-client.scss';

const cn = classNames.bind(styles);

export const SingleClient = observer(() => {
  const {clientId} = useParams();

  const handleChangeProductTab = (value: SegmentedValue) => {
    singleClientStore.setActiveTabs(value as ISingleClientTabs);
  };

  useEffect(() => {
    if (clientId) {
      singleClientStore.getSingleClient({
        id: clientId,
        deedEndDate: singleClientStore.endDate!,
        deedStartDate: singleClientStore.startDate!,
      });
    }
  }, [clientId, singleClientStore.endDate, singleClientStore.startDate]);

  useEffect(() => () => {
    singleClientStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('single-client__head')}>
        <Segmented
          defaultValue={ISingleClientTabs.ORDER}
          onChange={handleChangeProductTab}
          options={singleClientTabOptions}
          className={cn('single-client__segment')}
        />

        <Typography.Title
          className={cn('single-client__title')}
          level={3}
        >
          Jami qarz: {singleClientStore?.activeClient?.debt}
        </Typography.Title>
      </div>

      {SegmentComponents[singleClientStore?.activeTabs]}
    </main>
  );
});
