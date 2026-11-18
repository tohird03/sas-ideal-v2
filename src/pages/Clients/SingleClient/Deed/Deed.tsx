import React, {useState} from 'react';
import {useParams} from 'react-router-dom';
import {observer} from 'mobx-react';
import {DownloadOutlined} from '@ant-design/icons';
import {Button, DatePicker, DatePickerProps, Table, Typography} from 'antd';
import classNames from 'classnames';
import dayjs from 'dayjs';
import {clientsInfoApi} from '@/api/clients';
import {singleClientStore} from '@/stores/clients';
import {addNotification} from '@/utils';
import {priceFormat} from '@/utils/priceFormat';
import {deedColumns} from './constants';
import styles from './deed.scss';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const {clientId} = useParams();
  const [downloadLoadingDeed, setDownLoadLoadingDeed] = useState(false);
  const [downloadLoadingDeedProduct, setDownLoadLoadingDeedProduct] = useState(false);

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setStartDate(null);
    }
    singleClientStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setEndDate(null);
    }
    singleClientStore.setEndDate(new Date(dateString));
  };

  const handleDownloadExcelDeed = () => {
    setDownLoadLoadingDeed(true);
    clientsInfoApi.getUploadDeedToExel({
      id: clientId!,
      deedStartDate: singleClientStore?.startDate!,
      deedEndDate: singleClientStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${singleClientStore?.activeClient?.fullname}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeed(false);
      });
  };

  const handleDownloadExcelDeedProducts = () => {
    setDownLoadLoadingDeedProduct(true);
    clientsInfoApi.getUploadDeedToExelWithProducts({
      id: clientId!,
      deedStartDate: singleClientStore?.startDate!,
      deedEndDate: singleClientStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${singleClientStore?.activeClient?.fullname}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeedProduct(false);
      });
  };

  return (
    <main>
      <div className={cn('deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('deed__filter')}>
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(singleClientStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(singleClientStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleDownloadExcelDeed}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeed}
          >
            Excelga yuklash
          </Button>
          <Button
            onClick={handleDownloadExcelDeedProducts}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeedProduct}
          >
            Mahsulotlar bilan yuklash
          </Button>
        </div>
      </div>

      <Table
        columns={deedColumns}
        dataSource={singleClientStore?.activeClient?.deedInfo?.deeds || []}
        bordered
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{textAlign: 'center'}}>{priceFormat(singleClientStore?.activeClient?.deedInfo?.totalDebit)}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                <div style={{textAlign: 'center'}}>{priceFormat(singleClientStore?.activeClient?.deedInfo?.totalCredit)}</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} index={2}>
                <div style={{textAlign: 'center'}}>
                  {priceFormat((singleClientStore?.activeClient?.deedInfo?.debt))}
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />
    </main>
  );
});
