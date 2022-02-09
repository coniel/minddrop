import { TOPICS_TEST_DATA } from '@minddrop/topics';
import React from 'react';
import '../test-utils/initialize-stories';
import { TopicViewOptionsMenu } from './TopicViewOptionsMenu';

const { tSailing } = TOPICS_TEST_DATA;

export default {
  title: 'app/TopicViewOptionsMenu',
  component: TopicViewOptionsMenu,
};

export const Default: React.FC = () => (
  <TopicViewOptionsMenu topic={tSailing} trail={[tSailing.id]} />
);
