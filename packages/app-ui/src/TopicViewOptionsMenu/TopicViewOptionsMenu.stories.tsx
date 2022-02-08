import React from 'react';
import '../tests/setup-stories';
import { tSailing } from '../tests/topics.data';
import { TopicViewOptionsMenu } from './TopicViewOptionsMenu';

export default {
  title: 'app/TopicViewOptionsMenu',
  component: TopicViewOptionsMenu,
};

export const Default: React.FC = () => (
  <TopicViewOptionsMenu topic={tSailing} trail={[tSailing.id]} />
);
