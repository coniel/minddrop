import React from 'react';
import { setup } from '../../tests/setup-tests';
import { tCoastalNavigationView } from '../../tests/topics.data';
import { TopicView } from './TopicView';

export default {
  title: 'app/TopicView',
  component: TopicView,
};

setup();

export const Default: React.FC = () => {
  return (
    <div style={{ margin: -16 }}>
      <TopicView {...tCoastalNavigationView} />
    </div>
  );
};
