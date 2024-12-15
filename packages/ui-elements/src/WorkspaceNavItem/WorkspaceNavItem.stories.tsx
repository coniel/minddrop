import React from 'react';
import { DocumentNavItem } from '../DocumentNavItem';
import { Icon } from '../Icon';
import { WorkspaceNavItem } from './WorkspaceNavItem';

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
