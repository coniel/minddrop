import React from 'react';
import '../../tests/setup-stories';
import { tCoastalNavigationView } from '../../tests/topics.data';
import { TopicView } from './TopicView';

export default {
  title: 'app/TopicView',
  component: TopicView,
};

export const Default: React.FC = () => {
  return (
    <div style={{ margin: -16 }}>
      <TopicView {...tCoastalNavigationView} />
    </div>
  );
};
