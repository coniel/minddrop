import React from 'react';
import { DocumentNavItem } from '../DocumentNavItem';
import { Icon } from '../Icon';
import { CollectionNavItem } from './CollectionNavItem';

export default {
  title: 'ui/CollectionNavItem',
  component: CollectionNavItem,
};

export const Default: React.FC = () => (
  <div>
    <CollectionNavItem
      label="Projects"
      icon={<Icon name="cube" color="light" />}
    >
      <DocumentNavItem label="Minddrop" />
    </CollectionNavItem>
    <CollectionNavItem
      active
      label="Projects"
      icon={<Icon name="cube" color="light" />}
    >
      Content
    </CollectionNavItem>
  </div>
);
