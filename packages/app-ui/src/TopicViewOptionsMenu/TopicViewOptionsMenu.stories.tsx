import { initializeCore } from '@minddrop/core';
import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import React, { useEffect } from 'react';
import { TopicViewOptionsMenu } from './TopicViewOptionsMenu';

const { tSailing, tCoastalNavigation, tUntitled } = TOPICS_TEST_DATA;

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export default {
  title: 'app-ui/TopicViewOptionsMenu',
  component: TopicViewOptionsMenu,
};

export const WithSingleParent: React.FC = () => (
  <TopicViewOptionsMenu trail={[tSailing.id]} />
);

export const WithMultipleParent: React.FC = () => {
  useEffect(() => {
    Topics.addSubtopics(core, tUntitled.id, [tCoastalNavigation.id]);
  }, []);

  return <TopicViewOptionsMenu trail={[tCoastalNavigation.id]} />;
};
