import React from 'react';
import { TopicViewColumns } from './TopicViewColumns';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

export const Default: React.FC = () => {
  return <TopicViewColumns instanceId={topicViewColumnsInstance.id} />;
};
