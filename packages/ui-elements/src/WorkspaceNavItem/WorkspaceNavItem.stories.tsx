import React from 'react';
import { WorkspaceNavItem } from './WorkspaceNavItem';
import { Icon } from '../Icon';
import { DocumentNavItem } from '../DocumentNavItem';

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
      <DocumentNavItem label="Minddrop" />
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
