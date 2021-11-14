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
import { Icon } from '../Icon';

export default {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
};

export const GeneratedFromContentProp: React.FC = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton label="Drop options">
        <Icon name="more-vertical" />
      </IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
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
);

export const ComposedWithComponents: React.FC = () => (
  <div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label="Drop options">
          <Icon name="more-vertical" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: 240 }}>
        <DropdownMenuItem
          label="Add title"
          icon={<Icon name="title" />}
          keyboardShortcut={['Ctrl', 'T']}
          onSelect={() => console.log('Add title')}
        />
        <DropdownMenuItem
          label="Add note"
          icon={<Icon name="note" />}
          keyboardShortcut={['Ctrl', 'Shift', 'N']}
          onSelect={() => console.log('Add note')}
        />
        <DropdownMenu>
          <DropdownMenuTriggerItem
            label="Turn into"
            icon={<Icon name="turn-into" />}
          />
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
          icon={<Icon name="link" />}
          keyboardShortcut={['Ctrl', 'Shift', 'C']}
          onSelect={() => console.log('Copy link')}
        />
        <DropdownMenuItem
          label="Move to"
          icon={<Icon name="arrow-up-right" />}
          keyboardShortcut={['Ctrl', 'M']}
          onSelect={() => console.log('Move to')}
          tooltipTitle="Move drop to another topic"
        />
        <DropdownMenuItem
          label="Add to"
          icon={<Icon name="inside" />}
          keyboardShortcut={['Ctrl', 'A']}
          onSelect={() => console.log('Add to')}
          tooltipTitle="Add drop to another topic"
          tooltipDescription="Drops appearing in multiple topics are kept in sync."
        />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);
