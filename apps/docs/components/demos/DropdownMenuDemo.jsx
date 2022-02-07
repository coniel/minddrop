/* eslint-disable no-console */
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  IconButton,
} from '@minddrop/ui';

export const DropdownMenuDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton
          icon="more-vertical"
          label="Drop options"
          color="contrast"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{ width: 240 }}
        content={[
          {
            type: 'menu-item',
            label: 'Add title',
            icon: 'title',
            onSelect: () => console.log('Add title'),
            keyboardShortcut: ['Ctrl', 'T'],
          },
          {
            type: 'menu-item',
            label: 'Add note',
            icon: 'note',
            onSelect: () => console.log('Add note'),
            keyboardShortcut: ['Ctrl', 'Shift', 'N'],
          },
          {
            type: 'menu-item',
            label: 'Turn into',
            icon: 'turn-into',
            submenu: [
              {
                type: 'menu-item',
                label: 'Text',
                onSelect: () => console.log('Turn into text'),
              },
              {
                type: 'menu-item',
                label: 'Image',
                onSelect: () => console.log('Turn into image'),
              },
              {
                type: 'menu-item',
                label: 'Equation',
                onSelect: () => console.log('Turn into equation'),
              },
            ],
          },
          {
            type: 'menu-separator',
          },
          {
            type: 'menu-label',
            label: 'Actions',
          },
          {
            type: 'menu-item',
            label: 'Copy link',
            icon: 'link',
            onSelect: () => console.log('Copy link'),
            keyboardShortcut: ['Ctrl', 'Shift', 'C'],
          },
          {
            type: 'menu-item',
            label: 'Move to',
            icon: 'arrow-up-right',
            onSelect: () => console.log('Move to'),
            keyboardShortcut: ['Ctrl', 'M'],
            tooltipTitle: 'Move drop to another topic',
          },
          {
            type: 'menu-item',
            label: 'Add to',
            icon: 'inside',
            onSelect: () => console.log('Add to'),
            keyboardShortcut: ['Ctrl', 'A'],
            tooltipTitle: 'Add drop to another topic',
            tooltipDescription:
              'Drops appearing in multiple topics are kept in sync.',
          },
        ]}
      />
    </DropdownMenu>
  </div>
);

export default DropdownMenuDemo;
