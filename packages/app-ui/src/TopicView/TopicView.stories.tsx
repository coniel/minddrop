import { useCurrentView } from '@minddrop/app';
import { App } from '@minddrop/app/src/App';
import React from 'react';
import { TopicViewProps } from './TopicView';
import { core } from '../tests/setup-stories';
import { topicTrail } from '../tests/topics.data';
import { TopicView } from './TopicView';

export default {
  title: 'app/TopicView',
  component: TopicView,
};

App.openTopicView(core, topicTrail);

export const Default: React.FC = () => {
  const { instance } = useCurrentView();

  return (
    <div style={{ margin: -16 }}>
      {instance && <TopicView {...(instance as TopicViewProps)} />}
    </div>
  );
};
