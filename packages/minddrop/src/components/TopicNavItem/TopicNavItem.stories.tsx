import React from 'react';
import { TopicNavItem } from './TopicNavItem';
import { tSailing } from '../../tests/topics.data';
import { setup } from '../../tests/setup-tests';

setup();

export default {
  title: 'app/TopicNavItem',
  component: TopicNavItem,
};

export const Default: React.FC = () => (
  <div>
    <TopicNavItem id={tSailing.id} />
  </div>
);
