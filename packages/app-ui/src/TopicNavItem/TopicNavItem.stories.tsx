import React from 'react';
import { TopicNavItem } from './TopicNavItem';
import '../test-utils/initialize-stories';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicNavItem',
  component: TopicNavItem,
};

export const Default: React.FC = () => (
  <div>
    <TopicNavItem trail={[tSailing.id]} />
  </div>
);
