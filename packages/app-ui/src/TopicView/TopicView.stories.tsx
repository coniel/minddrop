import { useCurrentView } from '@minddrop/app';
import { App } from '@minddrop/app/src/App';
import React from 'react';
import { TopicViewProps } from './TopicView';
import { core } from '../test-utils/initialize-stories';
import { TopicView } from './TopicView';
import { TOPICS_TEST_DATA } from '@minddrop/topics';

const { trail } = TOPICS_TEST_DATA;

export default {
  title: 'app-ui/TopicView',
  component: TopicView,
};

App.openTopicView(core, trail);

export const Default: React.FC = () => {
  const { instance } = useCurrentView();

  return (
    <div style={{ margin: -16 }}>
      {instance && <TopicView {...(instance as TopicViewProps)} />}
    </div>
  );
};
