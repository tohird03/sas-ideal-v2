import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IChatInboxItem, IChatList, IChatMessage, IChatResult} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ChatApi extends Instance {
  constructor(networkConfig: INetworkConfig) {
    super(networkConfig);
  }

  inbox = (): Promise<IChatResult<IChatInboxItem[]>> => this.get(Endpoints.ChatInbox);

  markRead = (clientId: string): Promise<IChatResult<{clientId: string}>> =>
    this.resPost(Endpoints.ChatRead, {clientId});

  getMany = (clientId: string): Promise<IChatResult<IChatList>> =>
    this.get(Endpoints.ChatMany, {params: {clientId, pagination: false}});

  sendText = (clientId: string, text: string): Promise<IChatResult<IChatMessage>> =>
    this.resPost(Endpoints.ChatOne, {clientId, text});

  deleteOne = async (id: string): Promise<IChatResult<{id: string, telegramDeleted: boolean}>> => {
    const response = await this.delete(Endpoints.ChatOne, {params: {id}});

    return response.data;
  };
}

export const chatApi = new ChatApi(config);
