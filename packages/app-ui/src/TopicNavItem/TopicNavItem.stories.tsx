import React from 'react';
import { TopicNavItem } from './TopicNavItem';
import { tSailing } from '../tests/topics.data';
import '../tests/setup-stories';

export default {
  title: 'app/TopicNavItem',
  component: TopicNavItem,
};

export const Default: React.FC = () => (
  <div>
    <TopicNavItem trail={[tSailing.id]} />
  </div>
);
