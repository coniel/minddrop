import React from 'react';
import { MindDrop } from './MindDrop';

export default {
  title: 'minddrop/MindDrop',
  component: MindDrop,
};

export const App: React.FC = () => {
  return (
    <div
      style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
    >
      <MindDrop appId="app" />
    </div>
  );
};
