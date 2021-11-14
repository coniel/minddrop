/* eslint-disable no-console */
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  IconButton,
  Icon,
} from '@minddrop/ui';

export const DropdownMenuDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton label="Drop options" color="contrast">
          <Icon name="more-vertical" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        style={{ width: 240 }}
        content={[
          {
            label: 'Add title',
            icon: <Icon name="title" />,
            onSelect: () => console.log('Add title'),
            keyboardShortcut: ['Ctrl', 'T'],
          },
          {
            label: 'Add note',
            icon: <Icon name="note" />,
            onSelect: () => console.log('Add note'),
            keyboardShortcut: ['Ctrl', 'Shift', 'N'],
          },
          {
            label: 'Turn into',
            icon: <Icon name="turn-into" />,
            submenu: [
              {
                label: 'Text',
                onSelect: () => console.log('Turn into text'),
              },
              {
                label: 'Image',
                onSelect: () => console.log('Turn into image'),
              },
              {
                label: 'Equation',
                onSelect: () => console.log('Turn into equation'),
              },
            ],
          },
          '---',
          'Actions',
          {
            label: 'Copy link',
            icon: <Icon name="link" />,
            onSelect: () => console.log('Copy link'),
            keyboardShortcut: ['Ctrl', 'Shift', 'C'],
          },
          {
            label: 'Move to',
            icon: <Icon name="arrow-up-right" />,
            onSelect: () => console.log('Move to'),
            keyboardShortcut: ['Ctrl', 'M'],
            tooltipTitle: 'Move drop to another topic',
          },
          {
            label: 'Add to',
            icon: <Icon name="inside" />,
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
