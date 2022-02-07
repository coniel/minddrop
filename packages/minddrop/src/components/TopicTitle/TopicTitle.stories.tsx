import React from 'react';
import { tSailing } from '../../tests/topics.data';
import { setup } from '../../tests/setup-tests';
import { TopicTitle } from './TopicTitle';

setup();

export default {
  title: 'app/TopicTitle',
  component: TopicTitle,
};

export const Default: React.FC = () => <TopicTitle topic={tSailing} />;
