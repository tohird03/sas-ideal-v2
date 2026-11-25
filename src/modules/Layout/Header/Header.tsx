import './header.scss';

import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { CloseOutlined, MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout as AntdLayout, MenuProps, Typography, Modal } from 'antd';
import { useStores } from '@/stores';
import { CloseDay } from '../CloseDay';
import { LogOut } from '../LogOut/LogOut';
import { staffsStore } from '@/stores/workers';
import { SparkIcon } from '@/pages/Ai/icons';
import { AiChat } from '@/pages/Ai';

type Props = {
  collapsed: boolean;
  onCollapsedClick: () => void;
  isMobile?: boolean;
};

export const Header = observer(({ collapsed, onCollapsedClick, isMobile }: Props) => {
  const { authStore } = useStores();
  const [openAi, setOpenAi] = useState(false);

  const handleOpenAiModal = () => {
    setOpenAi(true);
  }

  const handleModalClose = () => {
    setOpenAi(false);
  }

  const items: MenuProps['items'] = [
    ...(isMobile
      ? [{
        key: '2',
        label: (
          <>
            <Typography.Title level={5} style={{ margin: '0' }}>
              {authStore.staffInfo?.fullname}
            </Typography.Title>
            <Typography.Title level={5} style={{ margin: '0' }}>
              +{authStore.staffInfo?.phone}
            </Typography.Title>
          </>
        ),
      }] : []),
    {
      key: '1',
      label: <LogOut />,
    },
    {
      key: '2',
      label: <CloseDay />,
    },
  ];

  return (
    <AntdLayout.Header className={`header header__isclose-${authStore?.isCloseDay}`}>
      <div className="header__left">
        <Button type="text" onClick={onCollapsedClick}>
          {collapsed
            ? <MenuUnfoldOutlined className="header__icon" />
            : <MenuFoldOutlined className="header__icon" />}
        </Button>
        {!isMobile && authStore.isCloseDay && <span className="layout__logo-text">SAS Ideal || Kassa yopilgan</span>}
        {isMobile &&
          <span className="layout__logo-text">
            {authStore.isCloseDay ? 'Kun yopilgan' : 'SAS-IDEAL'}
          </span>
        }

        <div className="header__profile">
          {authStore.staffInfo?.phone === '998981157574' && (
            <button className="ai-trigger" onClick={handleOpenAiModal}>
              <span className="ai-trigger__icon">
                <SparkIcon color="#fff" width={23} height={23} />
              </span>

              <span className="ai-trigger__text">
                <strong>SAS-IDEAL AI</strong>
                <small>Sun’iy intellekt</small>
              </span>

              <span className="ai-trigger__arrow">↗</span>
            </button>
          )}
          {!isMobile && (
            <>
              <Typography.Title level={5} style={{ color: 'white', margin: '0' }}>
                {authStore.staffInfo?.fullname}
              </Typography.Title>
              <Typography.Title level={5} style={{ color: 'white', margin: '0' }}>
                +{authStore.staffInfo?.phone}
              </Typography.Title>
            </>
          )}
          <Dropdown menu={{ items }} placement="bottomRight">
            <Avatar style={{ backgroundColor: '#1677FF' }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </div>

      <Modal
        open={openAi}
        onCancel={handleModalClose}
        // onOk={handleModalOk}
        // okText={paymentsStore.singlePayment ? 'To\'lovni tahrirlash' : 'To\'lov qo\'shish'}
        cancelText="Bekor qilish"
        cancelButtonProps={{ icon: <CloseOutlined /> }}
        centered
        style={{ top: 0, padding: 0 }}
        bodyStyle={{
          overflow: 'auto',
          height: '95dvh',
        }}
        width="100vw"
        footer={false}
      >
        <AiChat />
      </Modal>
    </AntdLayout.Header>
  );
});
