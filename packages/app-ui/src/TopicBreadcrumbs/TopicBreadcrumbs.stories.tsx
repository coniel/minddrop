import React from 'react';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { TopicBreadcrumbs } from './TopicBreadcrumbs';

const { trail } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicBreadcrumbs',
  component: TopicBreadcrumbs,
};

export const Default: React.FC = () => <TopicBreadcrumbs trail={trail} />;
