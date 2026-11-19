import React, {useState} from 'react';
import {Tabs, Typography} from 'antd';
import {ActivityBoards} from './ActivityBoards';
import {ProfitRank} from './ProfitRank';

enum ClientAnalyticsTab {
  Activity = 'activity',
  Profit = 'profit',
}

export const ClientAnalytics = () => {
  const [tab, setTab] = useState<ClientAnalyticsTab>(ClientAnalyticsTab.Activity);

  return (
    <main>
      <Typography.Title level={3}>Mijozlar tahlili</Typography.Title>
      <Tabs
        activeKey={tab}
        onChange={(key) => setTab(key as ClientAnalyticsTab)}
        items={[
          {key: ClientAnalyticsTab.Activity, label: 'Faollik'},
          {key: ClientAnalyticsTab.Profit, label: 'Foyda'},
        ]}
      />
      {tab === ClientAnalyticsTab.Activity ? <ActivityBoards /> : <ProfitRank />}
    </main>
  );
};
