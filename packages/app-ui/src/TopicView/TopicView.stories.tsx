import { TOPICS_TEST_DATA } from '@minddrop/topics';
import React from 'react';
import { TopicView } from './TopicView';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicView',
  component: TopicView,
};

export const Default: React.FC = () => (
  <div style={{ margin: -16 }}>
    <TopicView topicId={tSailing.id} />
  </div>
);
