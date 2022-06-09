import { TOPICS_TEST_DATA } from '@minddrop/topics';
import React from 'react';
import { TopicView } from './TopicView';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicView',
  component: TopicView,
};

export const Default: React.FC = () => {
  return (
    <div style={{ margin: -16 }}>
      <TopicView topic={tSailing.id} />
    </div>
  );
};
