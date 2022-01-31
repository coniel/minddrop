import React from 'react';
import { App, useCurrentView } from '@minddrop/app';
import { core } from '../../tests/initialize-app';
import { tCoastalNavigationView } from '../../tests/topics.data';
import '../../tests/initialize-app';
import { TopicView } from './TopicView';

export default {
  title: 'app/TopicView',
  component: TopicView,
};

App.openView(core, tCoastalNavigationView);

export const Default: React.FC = () => {
  const view = useCurrentView();

  return (
    <div style={{ margin: -16 }}>
      <TopicView resource={view.resource} breadcrumbs={view.breadcrumbs} />
    </div>
  );
};
