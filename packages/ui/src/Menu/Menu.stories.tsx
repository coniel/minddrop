import React from 'react';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { MenuLabel } from './MenuLabel';
import { MenuSeparator } from './MenuSeparator';
import { Icon } from '../Icon';

export default {
  title: 'ui/Menu',
  component: Menu,
};

export const Default: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
    <Menu>
      <MenuItem
        label="Add title"
        icon={<Icon name="title" />}
        keyboardShortcut={['Ctrl', 'T']}
      />
      <MenuItem
        label="Add note"
        icon={<Icon name="note" />}
        keyboardShortcut={['Ctrl', 'Shift', 'N']}
      />
      <MenuItem hasSubmenu label="Turn into" icon={<Icon name="turn-into" />} />
      <MenuSeparator />
      <MenuLabel>Actions</MenuLabel>
      <MenuItem
        label="Copy link"
        icon={<Icon name="link" />}
        keyboardShortcut={['Ctrl', 'Shift', 'C']}
      />
      <MenuItem
        label="Move to"
        icon={<Icon name="arrow-up-right" />}
        keyboardShortcut={['Ctrl', 'Shift', 'M']}
      />
      <MenuItem
        label="Add to"
        icon={<Icon name="inside" />}
        keyboardShortcut={['Ctrl', 'Shift', 'A']}
      />
    </Menu>
  </div>
);
