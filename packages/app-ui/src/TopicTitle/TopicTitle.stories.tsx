import React from 'react';
import { tSailing } from '../tests/topics.data';
import '../tests/setup-stories';
import { TopicTitle } from './TopicTitle';

export default {
  title: 'app/TopicTitle',
  component: TopicTitle,
};

export const Default: React.FC = () => <TopicTitle topic={tSailing} />;
