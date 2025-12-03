import {makeAutoObservable} from 'mobx';
import {MenuProps} from 'antd/es/menu/menu';
import {IMyProfile} from '@/api/app';
import {IMenuItems} from '@/constants';
import {TInitial} from './types';

export class AppStore {
  initialParams: Partial<TInitial> | null = null;
  mainMenuItems: MenuProps['items'] | null = null;
  breadcrumbList: IMenuItems[] | null = null;
  staffInfo: IMyProfile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setInitialParams = (params: Partial<TInitial>) => {
    this.initialParams = params;
  };

  reset = () => {
    this.initialParams = null;
    this.breadcrumbList = null;
  };

}

export const appStore = new AppStore();
