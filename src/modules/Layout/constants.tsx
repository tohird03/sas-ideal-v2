import React from 'react';
import {
  AppstoreAddOutlined,
  BarChartOutlined,
  BellOutlined,
  CodeSandboxOutlined,
  ContactsOutlined,
  DollarOutlined,
  DownloadOutlined,
  FileSyncOutlined,
  HomeOutlined,
  MessageOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import {ROUTES} from '@/constants';
import {IMenuItems} from './types';
import { EPageAccess } from '@/api/staffs';

export const mainMenuList: IMenuItems[] = [
  {
    label: 'Bosh sahifa',
    key: ROUTES.home,
    icon: <HomeOutlined />,
    children: [
      {
        label: <><AppstoreAddOutlined /> Statistika</>,
        key: ROUTES.home,
        roleKey: EPageAccess.STAT,
      },
    ],
  },
  {
    label: 'Mahsulotlar',
    key: ROUTES.products,
    icon: <CodeSandboxOutlined />,
    children: [
      {
        label: <><AppstoreAddOutlined /> Mahsulotlar ro&apos;yxati</>,
        key: ROUTES.productsList,
        roleKey: EPageAccess.PRODUCT,
      },
      {
        label: <><ShoppingCartOutlined /> Sotuvlar ro&apos;yxati</>,
        key: ROUTES.productsOrder,
        roleKey: EPageAccess.SELLING,
      },
      {
        label: <><DownloadOutlined /> Tushurilgan mahsulotlar</>,
        key: ROUTES.productsIncome,
        roleKey: EPageAccess.ARRIVAL,
      },
      {
        label: <><FileSyncOutlined /> Mijozdan qaytgan mahsulotlar</>,
        key: ROUTES.productsReturnedOrder,
        roleKey: EPageAccess.RETURNING,
      },
    ],
  },
  {
    label: 'Mijozlar',
    key: ROUTES.clients,
    icon: <TeamOutlined />,
    children: [
      {
        label: <><UserOutlined /> Mijozlar ro&apos;yxati</>,
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
        label: <><MessageOutlined /> Chat</>,
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
    icon: <UsergroupAddOutlined />,
    children: [
      {
        label: <><ContactsOutlined /> Yetkazib beruvchilar ro&apos;yxati</>,
        key: ROUTES.supplierInfo,
        roleKey: EPageAccess.SUPPLIER,
      },
      {
        label: <><ContactsOutlined /> To&apos;langan qarzlar ro&apos;yxati</>,
        key: ROUTES.supplierPayments,
        roleKey: EPageAccess.SUPPLIERPAYMENT,
      },
    ],
  },
  {
    label: 'Xodimlar',
    key: ROUTES.workers,
    icon: <SettingOutlined />,
    children: [
      {
        label: <><SolutionOutlined /> Xodimlar ro&apos;yxati</>,
        key: ROUTES.workersStaffs,
        roleKey: EPageAccess.STUFF,
      },
      {
        label: <><SolutionOutlined /> Xodimlar hisoboti</>,
        key: ROUTES.workersStaffsPayments,
        roleKey: EPageAccess.STUFFPAYMENT,
      },
    ],
  },
];
