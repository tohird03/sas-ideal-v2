import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {observer} from 'mobx-react';
import {Menu as AntdMenu} from 'antd';
import {MenuProps} from 'antd/es/menu/menu';
import {useStores} from '@/stores';

export const Menu = observer(() => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const {authStore} = useStores();

  const handleClick: MenuProps['onClick'] = ({key, domEvent}) => {
    domEvent.preventDefault();
    domEvent.stopPropagation();
    navigate(key);
  };

  return (
    <AntdMenu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={[pathname]}
      items={authStore?.mainMenuItems!}
      onClick={handleClick}
    />
  );
});
