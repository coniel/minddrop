import React from 'react';
import { ContentColors } from '../constants';
import { Icon } from '../Icon';
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
        icon="text"
        keyboardShortcut={['Ctrl', 'T']}
      />
      <MenuItem
        label="Add note"
        icon="edit-2"
        keyboardShortcut={['Ctrl', 'Shift', 'N']}
      />
      <MenuItem hasSubmenu label="Turn into" icon="refresh" />
      <MenuSeparator />
      <MenuLabel>Actions</MenuLabel>
      <MenuItem
        label="Copy link"
        icon="link"
        keyboardShortcut={['Ctrl', 'Shift', 'C']}
      />
      <MenuItem
        label="Move to"
        icon="diagonal-arrow-right-up"
        keyboardShortcut={['Ctrl', 'Shift', 'M']}
      />
      <MenuItem
        label="Add to"
        icon="corner-down-right"
        keyboardShortcut={['Ctrl', 'Shift', 'A']}
      />
    </Menu>
  </div>
);

export const ColorSelection: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
    <Menu>
      {ContentColors.map((color) => (
        <ColorSelectionMenuItem key={color.value} color={color.value} />
      ))}
    </Menu>
  </div>
);

export const WithDescriptions: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
    <Menu>
      <MenuItem label="Text" description="A rich text drop" />
      <MenuItem
        label="Bookmark"
        description="Save a link as a visual bookmark"
      />
      <MenuItem label="Image" description="A simple image drop" />
    </Menu>
  </div>
);

export const Radio: React.FC = () => (
  <div style={{ maxWidth: 240 }}>
    <Menu>
      <MenuLabel>Appearance</MenuLabel>
      <MenuItem label="Use system setting" />
      <MenuItem
        data-state="checked"
        label="Light"
        itemIndicator={<Icon name="checkmark" />}
      />
      <MenuItem label="Dark" />
    </Menu>
  </div>
);
