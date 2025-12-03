import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {LogoutOutlined} from '@ant-design/icons';
import {Button, Modal, Typography} from 'antd';

export const CloseDay: React.FC = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    alert('Salom');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <span onClick={showModal} className="logout">
        <Button style={{width: '100%'}} type="primary" danger>Kunni yopish</Button>
      </span>
      <Modal
        title={'Rostdan ham bugungi kunni yopmoqchimisiz?'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yopish"
        okButtonProps={{style: {backgroundColor: 'red'}}}
        cancelText="Bekor qilish"
      />
    </div>
  );
});
