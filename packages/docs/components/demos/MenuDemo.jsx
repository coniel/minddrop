import React from 'react';
import { Menu, MenuItem, MenuLabel, MenuSeparator, Icon } from '@minddrop/ui';

export const MenuDemo = () => (
  <div style={{ width: 240 }}>
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

export default MenuDemo;
