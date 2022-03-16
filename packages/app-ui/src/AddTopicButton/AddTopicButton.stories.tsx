import React from 'react';
import { AddTopicButton } from './AddTopicButton';

export default {
  title: 'app-ui/AddTopicButton',
  component: AddTopicButton,
};

export const Default: React.FC = () => (
  <div style={{ maxWidth: 300 }}>
    <AddTopicButton />
  </div>
);
