import React, { useEffect } from 'react';
import { useViewInstance } from '@minddrop/views';
import '../test-utils/initialize-stories';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsInstance } from '../types';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';
import { Topics } from '@minddrop/topics';
import { createDataInsertFromDataTransfer } from '@minddrop/utils';
import { core } from '../test-utils/initialize-stories';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { App } from '@minddrop/app';

const { dropTypeConfigs } = DROPS_TEST_DATA;

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

export const Default: React.FC = () => {
  const viewInstance = useViewInstance<TopicViewColumnsInstance>(
    topicViewColumnsInstance.id,
  );

  useEffect(() => {
    const callback = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SPAN') {
        return;
      }
      const dataInsert = createDataInsertFromDataTransfer(event.clipboardData);
      App.insertDataIntoTopic(core, viewInstance.topic, dataInsert);
    };

    document.addEventListener('paste', callback);

    return () => document.removeEventListener('paste', callback);
  }, []);

  return <TopicViewColumns {...viewInstance} />;
};
