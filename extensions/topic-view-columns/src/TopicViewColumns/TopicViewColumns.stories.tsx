import React from 'react';
import { TopicViewColumns } from './TopicViewColumns';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';
import { ViewInstances } from '@minddrop/views';
import { initializeCore } from '@minddrop/core';

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

const core = initializeCore({
  appId: 'app',
  extensionId: 'topic-view-columns',
});

ViewInstances.store.load(core, [topicViewColumnsInstance]);

export const Default: React.FC = () => {
  return <TopicViewColumns instanceId={topicViewColumnsInstance.id} />;
};
