import { initializeCore } from '@minddrop/core';
import React from 'react';
import { AddTopicButton } from './AddTopicButton';

export default {
  title: 'app/AddTopicButton',
  component: AddTopicButton,
};

const core = initializeCore({ appId: 'app', extensionId: 'app' });

export const Default: React.FC = () => (
  <div style={{ maxWidth: 300 }}>
    <AddTopicButton core={core} />
  </div>
);
