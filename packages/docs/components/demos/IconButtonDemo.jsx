import React from 'react';
import { IconButton, Icon } from '@minddrop/ui';

export const IconButtonDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <IconButton label="settings" color="contrast">
      <Icon name="settings" />
    </IconButton>
  </div>
);

export default IconButtonDemo;
