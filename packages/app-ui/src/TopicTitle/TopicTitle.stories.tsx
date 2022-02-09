import React from 'react';
import { TopicTitle } from './TopicTitle';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import '../test-utils/initialize-stories';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app/TopicTitle',
  component: TopicTitle,
};

export const Default: React.FC = () => <TopicTitle topic={tSailing} />;
