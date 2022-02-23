/* eslint-disable no-console */
import React from 'react';
import { ContextMenu } from './ContextMenu';
import { ContextMenuContent } from './ContextMenuContent';
import { ContextMenuItem } from './ContextMenuItem';
import { ContextMenuTriggerItem } from './ContextMenuTriggerItem';
import { ContextMenuLabel } from './ContextMenuLabel';
import { ContextMenuSeparator } from './ContextMenuSeparator';
import { ContextMenuTrigger } from './ContextMenuTrigger';
import { ContextMenuColorSelectionItem } from './ContextMenuColorSelectionItem';
import { ContentColors } from '../constants';

export default {
  title: 'ui/ContextMenu',
  component: ContextMenu,
};

export const GeneratedFromContentProp: React.FC = () => (
  <ContextMenu>
    <ContextMenuTrigger>
      <div
        style={{
          border: '2px dashed gray',
          borderRadius: 4,
          userSelect: 'none',
          padding: '45px 0',
          width: 300,
          textAlign: 'center',
        }}
      >
        Right click here.
      </div>
    </ContextMenuTrigger>
    <ContextMenuContent
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
          label: 'Color',
          icon: 'color-palette',
          submenu: ContentColors.map((color) => ({
            type: 'menu-color-selection-item',
            color: color.value,
            onSelect: () => console.log(color.value),
          })),
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
  </ContextMenu>
);

export const ComposedWithComponents: React.FC = () => (
  <div>
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          style={{
            border: '2px dashed gray',
            borderRadius: 4,
            userSelect: 'none',
            padding: '45px 0',
            width: 300,
            textAlign: 'center',
          }}
        >
          Right click here.
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent style={{ width: 240 }}>
        <ContextMenuItem
          label="Add title"
          icon="title"
          keyboardShortcut={['Ctrl', 'T']}
          onSelect={() => console.log('Add title')}
        />
        <ContextMenuItem
          label="Add note"
          icon="note"
          keyboardShortcut={['Ctrl', 'Shift', 'N']}
          onSelect={() => console.log('Add note')}
        />
        <ContextMenu>
          <ContextMenuTriggerItem label="Color" icon="color-palette" />
          <ContextMenuContent style={{ minWidth: 220 }}>
            {ContentColors.map((color) => (
              <ContextMenuColorSelectionItem
                key={color.value}
                color={color.value}
                onSelect={() => console.log(color.value)}
              />
            ))}
          </ContextMenuContent>
        </ContextMenu>
        <ContextMenu>
          <ContextMenuTriggerItem label="Turn into" icon="turn-into" />
          <ContextMenuContent>
            <ContextMenuItem
              label="Text"
              onSelect={() => console.log('Turn into text')}
            />
            <ContextMenuItem
              label="Image"
              onSelect={() => console.log('Turn into image')}
            />
            <ContextMenuItem
              label="Equation"
              onSelect={() => console.log('Turn into equation')}
            />
          </ContextMenuContent>
        </ContextMenu>
        <ContextMenuSeparator />
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuItem
          label="Copy link"
          icon="link"
          keyboardShortcut={['Ctrl', 'Shift', 'C']}
          onSelect={() => console.log('Copy link')}
        />
        <ContextMenuItem
          label="Move to"
          icon="arrow-up-right"
          keyboardShortcut={['Ctrl', 'M']}
          onSelect={() => console.log('Move to')}
          tooltipTitle="Move drop to another topic"
        />
        <ContextMenuItem
          label="Add to"
          icon="inside"
          keyboardShortcut={['Ctrl', 'A']}
          onSelect={() => console.log('Add to')}
          tooltipTitle="Add drop to another topic"
          tooltipDescription="Drops appearing in multiple topics are kept in sync."
        />
      </ContextMenuContent>
    </ContextMenu>
  </div>
);
