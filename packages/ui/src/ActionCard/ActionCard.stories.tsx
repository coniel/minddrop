import React from 'react';
import { ActionCard } from './ActionCard';
import { Button } from '../Button';

export default {
  title: 'ui/ActionCard',
  component: ActionCard,
};

export const Default: React.FC = () => (
  <div>
    <ActionCard
      icon="folder-add"
      title="New workspace"
      description="Create a new MindDrop workspace as a folder on your computer."
      action={<Button label="Create" variant="neutral" />}
    />
  </div>
);
