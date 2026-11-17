export type ChatDirection = 'in' | 'out' | 'system';

export interface IChatStaff {
  id: string;
  fullname: string;
}

export interface IChatMessage {
  id: string;
  clientId: string;
  direction: ChatDirection;
  text: string | null;
  telegramMessageId: number | null;
  staffId: string | null;
  staff: IChatStaff | null;
  createdAt: string;
}

export interface IChatList {
  data: IChatMessage[];
  totalCount: number;
  pageSize: number;
  pagesCount: number;
}

export interface IChatInboxItem {
  id: string;
  fullname: string;
  phone: string;
  telegram: {isActive: boolean} | null;
  incomingCount: number;
  unreadCount: number;
  lastMessage: {
    text: string | null;
    direction: ChatDirection;
    createdAt: string;
  };
}

export interface IChatResult<T> {
  data: T;
  warning?: {
    is: boolean;
    messages: string[];
  };
}
