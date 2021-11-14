import React from 'react';
import { Toolbar, ToolbarIconButton } from './Toolbar';
import { Icon } from '../Icon';

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
      <ToolbarIconButton label="Sync">
        <Icon name="cloud-upload" />
      </ToolbarIconButton>
      <ToolbarIconButton label="Settings">
        <Icon name="settings" />
      </ToolbarIconButton>
      <ToolbarIconButton label="New window">
        <Icon name="duplicate" />
      </ToolbarIconButton>
    </Toolbar>
  </div>
);
