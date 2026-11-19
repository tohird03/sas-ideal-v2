import React from 'react';
import {
  AccountBookOutlined,
  BarChartOutlined,
  BellOutlined,
  ContactsOutlined,
  DollarOutlined,
  HomeOutlined,
  IdcardOutlined,
  ImportOutlined,
  MessageOutlined,
  PieChartOutlined,
  RiseOutlined,
  RollbackOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  SolutionOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import {EPageAccess} from '@/api/staffs';
import {ROUTES} from '@/constants';
import {IMenuItems} from './types';

export const mainMenuList: IMenuItems[] = [
  {
    label: 'Bosh sahifa',
    key: ROUTES.home,
    icon: <HomeOutlined />,
    children: [
      {
        label: <><PieChartOutlined /> Statistika</>,
        key: ROUTES.home,
        roleKey: EPageAccess.STAT,
      },
      {
        label: <><RiseOutlined /> Mahsulotlar tahlili</>,
        key: ROUTES.productAnalytics,
        roleKey: EPageAccess.STAT,
      },
      {
        label: <><TeamOutlined /> Mijozlar tahlili</>,
        key: ROUTES.clientAnalytics,
        roleKey: EPageAccess.STAT,
      },
    ],
  },
  {
    label: 'Mahsulotlar',
    key: ROUTES.products,
    icon: <ShoppingOutlined />,
    children: [
      {
        label: <><UnorderedListOutlined /> Mahsulotlar ro&apos;yxati</>,
        key: ROUTES.productsList,
        roleKey: EPageAccess.PRODUCT,
      },
      {
        label: <><ShoppingCartOutlined /> Sotuvlar ro&apos;yxati</>,
        key: ROUTES.productsOrder,
        roleKey: EPageAccess.SELLING,
      },
      {
        label: <><ImportOutlined /> Tushurilgan mahsulotlar</>,
        key: ROUTES.productsIncome,
        roleKey: EPageAccess.ARRIVAL,
      },
      {
        label: <><RollbackOutlined /> Mijozdan qaytgan mahsulotlar</>,
        key: ROUTES.productsReturnedOrder,
        roleKey: EPageAccess.RETURNING,
      },
    ],
  },
  {
    label: 'Mijozlar',
    key: ROUTES.clients,
    icon: <ContactsOutlined />,
    children: [
      {
        label: <><IdcardOutlined /> Mijozlar ro&apos;yxati</>,
        key: ROUTES.clientsInfo,
        roleKey: EPageAccess.CLIENT,
      },
      {
        label: <><DollarOutlined /> To&apos;lovlar ro&apos;yxati</>,
        key: ROUTES.clientsPayments,
        roleKey: EPageAccess.CLIENTPAYMENT,
      },
      {
        label: <><BarChartOutlined /> Mijozlar hisoboti</>,
        key: ROUTES.clientsStatistic,
        roleKey: EPageAccess.CLIENTSTATISTIC,
      },
      {
        label: <><MessageOutlined /> Suhbat</>,
        key: ROUTES.clientsChat,
        roleKey: EPageAccess.CHAT,
      },
      {
        label: <><BellOutlined /> Eslatmalar</>,
        key: ROUTES.reminders,
        roleKey: EPageAccess.REMINDER,
      },
    ],
  },
  {
    label: 'Yetkazib beruvchilar',
    key: ROUTES.supplier,
    icon: <ShopOutlined />,
    children: [
      {
        label: <><UnorderedListOutlined /> Yetkazib beruvchilar ro&apos;yxati</>,
        key: ROUTES.supplierInfo,
        roleKey: EPageAccess.SUPPLIER,
      },
      {
        label: <><WalletOutlined /> To&apos;langan qarzlar ro&apos;yxati</>,
        key: ROUTES.supplierPayments,
        roleKey: EPageAccess.SUPPLIERPAYMENT,
      },
    ],
  },
  {
    label: 'Xodimlar',
    key: ROUTES.workers,
    icon: <SolutionOutlined />,
    children: [
      {
        label: <><IdcardOutlined /> Xodimlar ro&apos;yxati</>,
        key: ROUTES.workersStaffs,
        roleKey: EPageAccess.STUFF,
      },
      {
        label: <><AccountBookOutlined /> Xodimlar hisoboti</>,
        key: ROUTES.workersStaffsPayments,
        roleKey: EPageAccess.STUFFPAYMENT,
      },
    ],
  },
];
