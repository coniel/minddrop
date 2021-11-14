import React from 'react';
import { Menu, MenuItem, MenuLabel, MenuSeparator } from '@minddrop/ui';

export const MenuDemo = () => (
  <div style={{ width: 240 }}>
    <Menu>
      <MenuItem
        label="Add title"
        icon="title"
        keyboardShortcut={['Ctrl', 'T']}
      />
      <MenuItem
        label="Add note"
        icon="note"
        keyboardShortcut={['Ctrl', 'Shift', 'N']}
      />
      <MenuItem hasSubmenu label="Turn into" icon="turn-into" />
      <MenuSeparator />
      <MenuLabel>Actions</MenuLabel>
      <MenuItem
        label="Copy link"
        icon="link"
        keyboardShortcut={['Ctrl', 'Shift', 'C']}
      />
      <MenuItem
        label="Move to"
        icon="arrow-up-right"
        keyboardShortcut={['Ctrl', 'Shift', 'M']}
      />
      <MenuItem
        label="Add to"
        icon="inside"
        keyboardShortcut={['Ctrl', 'Shift', 'A']}
      />
    </Menu>
  </div>
);

export default MenuDemo;
