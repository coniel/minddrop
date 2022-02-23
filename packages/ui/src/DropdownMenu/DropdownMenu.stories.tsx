/* eslint-disable no-console */
import React from 'react';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuItem } from './DropdownMenuItem';
import { DropdownMenuTriggerItem } from './DropdownMenuTriggerItem';
import { DropdownMenuLabel } from './DropdownMenuLabel';
import { DropdownMenuSeparator } from './DropdownMenuSeparator';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { IconButton } from '../IconButton';
import { DropdownMenuColorSelectionItem } from './DropdownMenuColorSelectionItem';
import { ContentColors } from '../constants';

export default {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
};

export const GeneratedFromContentProp: React.FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton icon="more-vertical" label="Drop options" />
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
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
  </DropdownMenu>
);

export const ComposedWithComponents: React.FC = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton icon="more-vertical" label="Drop options" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: 240 }}>
        <DropdownMenuItem
          label="Add title"
          icon="title"
          keyboardShortcut={['Ctrl', 'T']}
          onSelect={() => console.log('Add title')}
        />
        <DropdownMenuItem
          label="Add note"
          icon="note"
          keyboardShortcut={['Ctrl', 'Shift', 'N']}
          onSelect={() => console.log('Add note')}
        />
        <DropdownMenu>
          <DropdownMenuTriggerItem label="Color" icon="color-palette" />
          <DropdownMenuContent style={{ minWidth: 220 }}>
            {ContentColors.map((color) => (
              <DropdownMenuColorSelectionItem
                key={color.value}
                color={color.value}
                onSelect={() => console.log(color.value)}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTriggerItem label="Turn into" icon="turn-into" />
          <DropdownMenuContent>
            <DropdownMenuItem
              label="Text"
              onSelect={() => console.log('Turn into text')}
            />
            <DropdownMenuItem
              label="Image"
              onSelect={() => console.log('Turn into image')}
            />
            <DropdownMenuItem
              label="Equation"
              onSelect={() => console.log('Turn into equation')}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          label="Copy link"
          icon="link"
          keyboardShortcut={['Ctrl', 'Shift', 'C']}
          onSelect={() => console.log('Copy link')}
        />
        <DropdownMenuItem
          label="Move to"
          icon="arrow-up-right"
          keyboardShortcut={['Ctrl', 'M']}
          onSelect={() => console.log('Move to')}
          tooltipTitle="Move drop to another topic"
        />
        <DropdownMenuItem
          label="Add to"
          icon="inside"
          keyboardShortcut={['Ctrl', 'A']}
          onSelect={() => console.log('Add to')}
          tooltipTitle="Add drop to another topic"
          tooltipDescription="Drops appearing in multiple topics are kept in sync."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
