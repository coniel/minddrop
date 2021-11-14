import React from 'react';
import { Tooltip, IconButton, Icon } from '@minddrop/ui';

export const TooltipDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Tooltip title="New drop" keyboardShortcut={['Ctrl', 'N']}>
      <IconButton color="contrast">
        <Icon name="settings" />
      </IconButton>
    </Tooltip>
  </div>
);

export default TooltipDemo;
