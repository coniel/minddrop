import React from 'react';
import { Toolbar, ToolbarIconButton } from '@minddrop/ui';

export const ToolbarDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Toolbar
      style={{
        display: 'flex',
        padding: 10,
        width: '100%',
        minWidth: 'max-content',
        borderRadius: 6,
        backgroundColor: 'white',
        boxShadow: '0px 2px 10px rgba(0 0 0 0.14)',
      }}
    >
      <ToolbarIconButton icon="cloud-upload" label="Sync" />
      <ToolbarIconButton icon="settings" label="Settings" />
      <ToolbarIconButton icon="duplicate" label="Open new window" />
    </Toolbar>
  </div>
);

export default ToolbarDemo;
