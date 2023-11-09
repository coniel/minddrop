import React from 'react';
import { Toolbar, ToolbarIconButton } from './Toolbar';

export default {
  title: 'ui/Toolbar',
  component: Toolbar,
};

export const Default: React.FC = () => (
  <div>
    <Toolbar
      style={{
        display: 'flex',
        padding: 10,
        width: '100%',
        minWidth: 'max-content',
        borderRadius: 6,
        boxShadow: 'rgb(0 0 0 / 14%) 0px 2px 10px',
      }}
    >
      <ToolbarIconButton icon="cloud-upload" label="Sync" />
      <ToolbarIconButton icon="settings" label="Settings" />
      <ToolbarIconButton icon="copy" label="New window" />
    </Toolbar>
  </div>
);
