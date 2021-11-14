/* eslint-disable no-console */
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
} from '@minddrop/ui';

export const ContextMenuDemo = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            border: '2px dashed white',
            borderRadius: 4,
            userSelect: 'none',
            padding: '45px 0',
            width: 300,
            textAlign: 'center',
            color: 'white',
          }}
        >
          Right click here.
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent
        style={{ width: 240 }}
        content={[
          {
            label: 'Add title',
            icon: 'title',
            onSelect: () => console.log('Add title'),
            keyboardShortcut: ['Ctrl', 'T'],
          },
          {
            label: 'Add note',
            icon: 'note',
            onSelect: () => console.log('Add note'),
            keyboardShortcut: ['Ctrl', 'Shift', 'N'],
          },
          {
            label: 'Turn into',
            icon: 'turn-into',
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
            icon: 'link',
            onSelect: () => console.log('Copy link'),
            keyboardShortcut: ['Ctrl', 'Shift', 'C'],
          },
          {
            label: 'Move to',
            icon: 'arrow-up-right',
            onSelect: () => console.log('Move to'),
            keyboardShortcut: ['Ctrl', 'M'],
            tooltipTitle: 'Move drop to another topic',
          },
          {
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
    </ContextMenu>
  </div>
);

export default ContextMenuDemo;
