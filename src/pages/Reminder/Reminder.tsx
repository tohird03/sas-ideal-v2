import './reminder.scss';

import React, {useState} from 'react';
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, DatePicker, Form, Input, Modal, Popconfirm, Select, Typography} from 'antd';
import {ColumnType} from 'antd/es/table';
import {AxiosError} from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {useDebounce} from 'usehooks-ts';
import {clientsInfoApi} from '@/api/clients';
import {IReminder, IReminderForm, reminderApi} from '@/api/reminder';
import {DataTable} from '@/components/Datatable/datatable';
import {addNotification} from '@/utils';
import {dateFormat} from '@/utils/getDateFormat';
import {getPaginationParams} from '@/utils/getPaginationParams';
import {useMediaQuery} from '@/utils/mediaQuery';
import {formatPhoneNumber} from '@/utils/phoneFormat';

interface ReminderFormValues {
  clientId: string;
  startDate: Dayjs;
  sendHour: number;
  description: string;
}

const hours = Array.from({length: 24}, (_, hour) => ({value: hour, label: `${String(hour).padStart(2, '0')}:00`}));

export const Reminders = () => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 650px)');
  const [form] = Form.useForm<ReminderFormValues>();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IReminder | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [clientSearch, setClientSearch] = useState('');
  const [filterClientId, setFilterClientId] = useState<string>();
  const debouncedSearch = useDebounce(clientSearch, 300);

  const {data: reminders, isLoading} = useQuery({
    queryKey: ['reminders', pageNumber, pageSize, filterClientId],
    queryFn: () => reminderApi.getMany({pageNumber, pageSize, clientId: filterClientId}),
  });

  const {data: clients} = useQuery({
    queryKey: ['reminderClients', debouncedSearch],
    queryFn: () => clientsInfoApi.getClientsInfo({search: debouncedSearch, pageNumber: 1, pageSize: 20}),
  });

  const refresh = () => queryClient.invalidateQueries({queryKey: ['reminders']});

  const {mutate: removeReminder} = useMutation({
    mutationFn: (id: string) => reminderApi.deleteOne(id),
    onSuccess: refresh,
    onError: (error: AxiosError) => addNotification(error),
  });

  const {mutate: saveReminder, isPending} = useMutation({
    mutationFn: (values: ReminderFormValues) => {
      const body: IReminderForm = {
        clientId: values.clientId,
        startDate: values.startDate.format('YYYY-MM-DD'),
        sendHour: values.sendHour,
        description: values.description.trim(),
      };

      if (editing) {
        return reminderApi.updateOne(editing.id, body);
      }

      return reminderApi.createOne(body);
    },
    onSuccess: () => {
      setOpen(false);
      setEditing(null);
      form.resetFields();
      refresh();
    },
    onError: (error: AxiosError) => addNotification(error),
  });

  const openCreate = () => {
    setEditing(null);
    form.setFieldsValue({sendHour: 8, startDate: dayjs()});
    setOpen(true);
  };

  const openEdit = (reminder: IReminder) => {
    setEditing(reminder);
    form.setFieldsValue({
      clientId: reminder.clientId,
      startDate: dayjs(reminder.startDate),
      sendHour: reminder.sendHour,
      description: reminder.description,
    });
    setOpen(true);
  };

  const clientOptions = (clients?.data?.data || []).map((item) => ({
    value: item.id,
    label: `${item.fullname}${item.phone ? ` (+${formatPhoneNumber(item.phone)})` : ''}`,
  }));

  if (editing && !clientOptions.some((item) => item.value === editing.clientId)) {
    clientOptions.unshift({value: editing.clientId, label: editing.client.fullname});
  }

  const columns: ColumnType<IReminder>[] = [
    {
      key: 'index',
      title: '#',
      align: 'center',
      render: (_value, _record, index) => (pageNumber - 1) * pageSize + index + 1,
    },
    {
      key: 'client',
      title: 'Mijoz',
      align: 'center',
      dataIndex: ['client', 'fullname'],
      render: (_, record) => (
        <div>
          <div>{record.client.fullname}</div>
          <i>{record.client.phone ? `+${formatPhoneNumber(record.client.phone)}` : ''}</i>
        </div>
      ),
    },
    {key: 'startDate', title: 'Boshlanish', align: 'center', dataIndex: 'startDate', render: (value: string) => dateFormat(value)},
    {key: 'sendHour', title: 'Soat', align: 'center', dataIndex: 'sendHour', render: (value: number) => `${String(value).padStart(2, '0')}:00`},
    {key: 'description', title: 'Matn', align: 'center', dataIndex: 'description'},
    {key: 'lastSentOn', title: 'Oxirgi yuborilgan', align: 'center', dataIndex: 'lastSentOn', render: (value?: string) => value ? dateFormat(value) : '—'},
    {
      key: 'action',
      title: 'Action',
      align: 'center',
      render: (_, record) => (
        <div className="reminder-page__actions">
          <Button type="primary" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm
            title="Eslatmani o'chirish"
            description="Har kuni yuborish to'xtaydi."
            onConfirm={() => removeReminder(record.id)}
            okText="Ha"
            okButtonProps={{style: {background: 'red'}}}
            cancelText="Yo'q"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <main className="reminder-page">
      <div className="reminder-page__head">
        <Typography.Title level={3}>Eslatmalar</Typography.Title>
        <div className="reminder-page__filter">
          <Select
            allowClear
            showSearch
            filterOption={false}
            placeholder="Mijoz"
            className="reminder-page__client"
            onSearch={setClientSearch}
            onDropdownVisibleChange={(visible) => visible && setClientSearch('')}
            onChange={(value?: string) => {
              setFilterClientId(value);
              setPageNumber(1);
            }}
            options={(clients?.data?.data || []).map((item) => ({value: item.id, label: item.fullname}))}
          />
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={openCreate}>Eslatma qo&apos;shish</Button>
        </div>
      </div>
      <DataTable
        isMobile={isMobile}
        rowKey="id"
        columns={columns}
        data={reminders?.data?.data || []}
        loading={isLoading}
        pagination={{
          current: pageNumber,
          pageSize,
          total: reminders?.data?.totalCount,
          onChange: (page, size) => {
            setPageNumber(page);
            if (size) setPageSize(size);
          },
          ...getPaginationParams(reminders?.data?.totalCount),
        }}
      />
      <Modal
        open={open}
        title={editing ? 'Eslatmani tahrirlash' : 'Yangi eslatma'}
        onCancel={() => setOpen(false)}
        okText="Saqlash"
        cancelText="Bekor"
        confirmLoading={isPending}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(values) => saveReminder(values)}>
          <Form.Item name="clientId" label="Mijoz" rules={[{required: true, message: 'Mijozni tanlang'}]}>
            <Select
              showSearch
              filterOption={false}
              disabled={Boolean(editing)}
              onSearch={setClientSearch}
              options={clientOptions}
            />
          </Form.Item>
          <Form.Item name="startDate" label="Boshlanish sanasi" rules={[{required: true, message: 'Sanani tanlang'}]}>
            <DatePicker style={{width: '100%'}} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item name="sendHour" label="Yuborish soati" rules={[{required: true, message: 'Soatni tanlang'}]}>
            <Select options={hours} />
          </Form.Item>
          <Form.Item name="description" label="Matn" rules={[{required: true, message: 'Matn kiriting'}]}>
            <Input.TextArea rows={3} maxLength={1000} placeholder="eslatma matni" />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
};
