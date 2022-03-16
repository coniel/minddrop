import React from 'react';
import { Views } from '@minddrop/views';
import { TopicViewColumns } from './TopicViewColumns';
import { TopicViewColumnsInstance } from '../types';
import { topicViewColumnsInstance } from '../test-utils/topic-view-columns.data';

export default {
  title: 'topic views/TopicViewColumns',
  component: TopicViewColumns,
};

export const Default: React.FC = () => {
  const viewInstance = Views.getInstance<TopicViewColumnsInstance>(
    topicViewColumnsInstance.id,
  );

  return <TopicViewColumns {...viewInstance} />;
};
