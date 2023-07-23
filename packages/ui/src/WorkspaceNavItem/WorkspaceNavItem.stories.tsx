import React from 'react';
import { WorkspaceNavItem } from './WorkspaceNavItem';
import { Icon } from '../Icon';
import { TopicNavItem } from '../TopicNavItem';

export default {
  title: 'ui/WorkspaceNavItem',
  component: WorkspaceNavItem,
};

export const Default: React.FC = () => (
  <div>
    <WorkspaceNavItem
      label="Projects"
      icon={<Icon name="cube" color="light" />}
    >
      <TopicNavItem label="Minddrop" />
    </WorkspaceNavItem>
    <WorkspaceNavItem
      active
      label="Projects"
      icon={<Icon name="cube" color="light" />}
    >
      Content
    </WorkspaceNavItem>
  </div>
);
