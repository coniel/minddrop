import React from 'react';
import { Tooltip, IconButton } from '@minddrop/ui';

export const TooltipDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <Tooltip title="New drop" keyboardShortcut={['Ctrl', 'N']}>
      <IconButton icon="settings" color="contrast" />
    </Tooltip>
  </div>
);

export default TooltipDemo;
