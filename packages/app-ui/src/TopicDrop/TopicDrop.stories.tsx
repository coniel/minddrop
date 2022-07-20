import React from 'react';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { TopicDrop } from './TopicDrop';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicDrop',
  component: TopicDrop,
};

export const Default: React.FC = () => (
  <div style={{ padding: 16, display: 'flex' }}>
    <TopicDrop trail={[tSailing.id]} />
  </div>
);
