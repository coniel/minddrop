import React from 'react';
import { ContentColors } from '../constants';
import { ColorSelectionMenuItem } from './ColorSelectionMenuItem';
import { Menu } from './Menu';
import { MenuItem } from './MenuItem';
import { MenuLabel } from './MenuLabel';
import { MenuSeparator } from './MenuSeparator';

export default {
  title: 'ui/Menu',
  component: Menu,
};

export const Default: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
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

export const ColorSelection: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
    <Menu>
      {ContentColors.map((color) => (
        <ColorSelectionMenuItem color={color.value} />
      ))}
    </Menu>
  </div>
);
