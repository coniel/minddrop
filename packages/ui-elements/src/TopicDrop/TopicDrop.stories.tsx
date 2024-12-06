import React from 'react';
import { TopicDrop } from './TopicDrop';

export default {
  title: 'ui/TopicDrop',
  component: TopicDrop,
};

export const Default: React.FC = () => (
  <div>
    <TopicDrop label="Sailing" />
  </div>
);
