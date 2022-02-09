import React from 'react';
import { AddTopicButton } from './AddTopicButton';
import '../test-utils/initialize-stories';

export default {
  title: 'app/AddTopicButton',
  component: AddTopicButton,
};

export const Default: React.FC = () => (
  <div style={{ maxWidth: 300 }}>
    <AddTopicButton />
  </div>
);
