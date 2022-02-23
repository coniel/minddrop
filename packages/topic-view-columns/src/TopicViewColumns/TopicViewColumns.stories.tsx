import React from 'react';
import { useViewInstance } from '@minddrop/views';
import '../test-utils/initialize-stories';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsInstance } from '../types';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

export const Default: React.FC = () => {
  const viewInstance = useViewInstance<TopicViewColumnsInstance>(
    topicViewColumnsInstance.id,
  );

  return <TopicViewColumns {...viewInstance} />;
};
