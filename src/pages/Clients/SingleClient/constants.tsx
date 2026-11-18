import React from 'react';
import {Orders} from '@/pages/Products';
import {ISingleClientTabs} from '@/stores/clients';
import {Deed} from './Deed';
import {Payments} from './Payment';

export const singleClientTabOptions = [
  {
    value: ISingleClientTabs.ORDER,
    label: 'Mijozning xaridlari',
  },
  {
    value: ISingleClientTabs.PAYMENT,
    label: 'Mijozning to\'lovlari',
  },
  {
    value: ISingleClientTabs.DEED,
    label: 'Solishtirish dalolatnomalari',
  },
];

export const SegmentComponents: Record<ISingleClientTabs, any> = {
  [ISingleClientTabs.ORDER]: <Orders />,
  [ISingleClientTabs.PAYMENT]: <Payments />,
  [ISingleClientTabs.DEED]: <Deed />,
};
