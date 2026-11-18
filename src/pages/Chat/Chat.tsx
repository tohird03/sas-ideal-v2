import './chat.scss';

import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeftOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, SendOutlined} from '@ant-design/icons';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {Button, Empty, Input, notification, Popconfirm, Spin, Tag, Typography} from 'antd';
import {AxiosError} from 'axios';
import {useDebounce} from 'usehooks-ts';
import {chatApi, IChatMessage} from '@/api/chat';
import {clientsInfoApi} from '@/api/clients';
import {addNotification} from '@/utils';
import {getFullDateFormat} from '@/utils/getDateFormat';
import {useMediaQuery} from '@/utils/mediaQuery';
import {formatPhoneNumber} from '@/utils/phoneFormat';

const POLL_MS = 4000;

type ChatListClient = {
  id: string;
  fullname: string;
  phone: string;
  telegram?: {isActive: boolean} | null;
  unreadCount?: number;
  lastText?: string;
};

const showWarning = (result?: {warning?: {is?: boolean, messages?: string[]}}) => {
  if (result?.warning?.is && result.warning.messages?.length) {
    notification.warning({message: result.warning.messages.join(', '), placement: 'topRight'});
  }
};

type ChatListSource = {
  id: string;
  fullname: string;
  phone?: string | null;
  telegram?: {isActive?: boolean} | null;
  unreadCount?: number;
  lastMessage?: {text?: string | null};
};

const toClient = (item: ChatListSource): ChatListClient => ({
  id: item.id,
  fullname: item.fullname,
  phone: item.phone || '',
  telegram: item.telegram ? {isActive: Boolean(item.telegram.isActive)} : null,
  unreadCount: item.unreadCount || 0,
  lastText: item.lastMessage?.text || '',
});

export const ChatPage = () => {
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const threadRef = useRef<HTMLDivElement>(null);
  const pinToLatest = useRef(true);
  const [search, setSearch] = useState('');
  const [client, setClient] = useState<ChatListClient | null>(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const {data: inbox, isLoading: inboxLoading} = useQuery({
    queryKey: ['chatInbox'],
    queryFn: () => chatApi.inbox(),
    refetchInterval: POLL_MS,
  });

  const {data: directoryResult, isLoading: clientsLoading} = useQuery({
    queryKey: ['chatClients', debouncedSearch],
    queryFn: () => clientsInfoApi.getClientsInfo({
      search: debouncedSearch,
      pageNumber: 1,
      pageSize: 30,
    }),
  });

  const {data: history, isLoading: messagesLoading, isError: messagesError} = useQuery({
    queryKey: ['chatMessages', client?.id],
    queryFn: () => chatApi.getMany(client!.id),
    enabled: Boolean(client?.id),
    refetchInterval: client?.id ? POLL_MS : false,
  });

  const inboxItems = inbox?.data || [];
  const messages = useMemo(() => [...(history?.data?.data || [])].reverse(), [history]);

  useEffect(() => {
    if (!client?.id) return;
    chatApi.markRead(client.id).then(() => {
      queryClient.invalidateQueries({queryKey: ['chatInbox']});
    }).catch(() => undefined);
  }, [client?.id, messages.length, queryClient]);

  useLayoutEffect(() => {
    pinToLatest.current = true;
  }, [client?.id]);

  useLayoutEffect(() => {
    const node = threadRef.current;

    if (!node) return undefined;

    const pin = () => {
      if (pinToLatest.current) node.scrollTop = node.scrollHeight;
    };

    pin();
    const observer = new ResizeObserver(pin);

    observer.observe(node);

    return () => observer.disconnect();
  }, [messages, client?.id]);

  const handleSend = async () => {
    const value = text.trim();

    if (!client?.id || !value) return;
    setSending(true);

    try {
      const result = await chatApi.sendText(client.id, value);

      showWarning(result);
      setText('');
      await queryClient.invalidateQueries({queryKey: ['chatMessages', client.id]});
      await queryClient.invalidateQueries({queryKey: ['chatInbox']});
    } catch (error) {
      addNotification(error as AxiosError);
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await chatApi.deleteOne(id);

      showWarning(result);
      await queryClient.invalidateQueries({queryKey: ['chatMessages', client?.id]});
    } catch (error) {
      addNotification(error as AxiosError);
    }
  };

  const needle = debouncedSearch.trim().toLowerCase();
  const conversations = inboxItems
    .map(toClient)
    .filter((item) => !needle || item.fullname.toLowerCase().includes(needle) || item.phone.includes(needle));
  const chattedIds = new Set(conversations.map((item) => item.id));
  const directory = (directoryResult?.data?.data || [])
    .map(toClient)
    .filter((item) => !chattedIds.has(item.id) && item.telegram?.isActive);

  return (
    <main className={`chat-page${client && isMobile ? ' chat-page--open' : ''}`}>
      <div className="chat-page__head">
        <Typography.Title level={3}>Suhbat</Typography.Title>
      </div>
      <div className="chat-page__body">
        <aside className="chat-page__clients">
          <div className="chat-page__search-bar">
            <Input
              className="chat-page__search"
              placeholder="Mijozlarni qidirish"
              allowClear
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="chat-page__client-list">
            {(inboxLoading || clientsLoading) && <Spin style={{margin: 16}} />}
            {!inboxLoading && conversations.length === 0 && directory.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {conversations.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`chat-page__client${client?.id === item.id ? ' chat-page__client--active' : ''}`}
                onClick={() => setClient(item)}
              >
                <span className="chat-page__client-top">
                  <span className="chat-page__person">
                    <span className="chat-page__client-name">{item.fullname}</span>
                    <span className="chat-page__client-phone">+{formatPhoneNumber(item.phone)}</span>
                  </span>
                  {(item.unreadCount || 0) > 0 && client?.id !== item.id && (
                    <span className="chat-page__badge">{item.unreadCount}</span>
                  )}
                </span>
                {item.lastText && <span className="chat-page__preview">{item.lastText}</span>}
              </button>
            ))}
            {directory.length > 0 && <div className="chat-page__section">Telegramdagi mijozlar</div>}
            {directory.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`chat-page__client${client?.id === item.id ? ' chat-page__client--active' : ''}`}
                onClick={() => setClient(item)}
              >
                <span className="chat-page__client-name">{item.fullname}</span>
                <span className="chat-page__client-phone">+{formatPhoneNumber(item.phone)}</span>
              </button>
            ))}
          </div>
        </aside>
        <section className="chat-page__thread-wrap">
          {!client && <div className="chat-page__empty">Mijozni tanlang</div>}
          {client && (
            <>
              <div className="chat-page__thread-head">
                {isMobile && (
                  <Button type="text" icon={<ArrowLeftOutlined />} aria-label="Ro'yxatga qaytish" onClick={() => setClient(null)} />
                )}
                <span className="chat-page__avatar">{(client.fullname || '?').trim().charAt(0).toUpperCase()}</span>
                <span className="chat-page__thread-person">
                  <span className="chat-page__thread-name">{client.fullname}</span>
                  <span className="chat-page__thread-phone">+{formatPhoneNumber(client.phone)}</span>
                </span>
                {client.telegram?.isActive ? <Tag color="green">Telegram</Tag> : <Tag>Telegram yo&apos;q</Tag>}
              </div>
              <div
                className="chat-page__thread"
                ref={threadRef}
                onScroll={(event) => {
                  const node = event.currentTarget;

                  pinToLatest.current = node.scrollHeight - node.scrollTop - node.clientHeight < 48;
                }}
              >
                {messagesLoading && <Spin />}
                {messagesError && <div className="chat-page__empty">Suhbat yuklanmadi</div>}
                {!messagesLoading && !messagesError && messages.length === 0 && <div className="chat-page__empty">Xabarlar yo&apos;q</div>}
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} clientName={client.fullname} onDelete={handleDelete} />
                ))}
              </div>
              <div className="chat-page__composer">
                <Input.TextArea
                  value={text}
                  autoSize={{minRows: 1, maxRows: 4}}
                  placeholder="Xabar"
                  onChange={(event) => setText(event.target.value)}
                  onPressEnter={(event) => {
                    if (!event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button type="primary" icon={<SendOutlined />} loading={sending} disabled={!text.trim()} onClick={handleSend}>
                  Yuborish
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

const MessageBubble = ({message, clientName, onDelete}: {message: IChatMessage, clientName: string, onDelete: (id: string) => void}) => {
  const own = message.direction === 'out' || message.direction === 'system';

  return (
    <div className={`chat-page__bubble chat-page__bubble--${message.direction}`}>
      <div className="chat-page__bubble-name">{own ? (message.staff?.fullname || 'Tizim') : clientName}</div>
      <div>{message.text}</div>
      <div className="chat-page__bubble-meta">
        <span>{getFullDateFormat(message.createdAt)}</span>
        <Popconfirm
          title="Xabar o'chirilsinmi?"
          onConfirm={() => onDelete(message.id)}
          okText="Ha"
          okButtonProps={{icon: <CheckOutlined />}}
          cancelText="Yo'q"
          cancelButtonProps={{icon: <CloseOutlined />}}
        >
          <button type="button" aria-label="O'chirish"><DeleteOutlined /></button>
        </Popconfirm>
      </div>
    </div>
  );
};
