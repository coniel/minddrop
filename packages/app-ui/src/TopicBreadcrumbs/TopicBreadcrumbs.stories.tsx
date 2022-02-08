import React from 'react';
import { topicTrail } from '../tests/topics.data';
import { TopicBreadcrumbs } from './TopicBreadcrumbs';

export default {
  title: 'app/TopicBreadcrumbs',
  component: TopicBreadcrumbs,
};

export const Default: React.FC = () => <TopicBreadcrumbs trail={topicTrail} />;
