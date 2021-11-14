/* eslint-disable no-console */
import React from 'react';
import { ContextMenu } from './ContextMenu';
import { ContextMenuContent } from './ContextMenuContent';
import { ContextMenuItem } from './ContextMenuItem';
import { ContextMenuTriggerItem } from './ContextMenuTriggerItem';
import { ContextMenuLabel } from './ContextMenuLabel';
import { ContextMenuSeparator } from './ContextMenuSeparator';
import { ContextMenuTrigger } from './ContextMenuTrigger';
import { Icon } from '../Icon';

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
          icon={<Icon name="title" />}
          keyboardShortcut={['Ctrl', 'T']}
          onSelect={() => console.log('Add title')}
        />
        <ContextMenuItem
          label="Add note"
          icon={<Icon name="note" />}
          keyboardShortcut={['Ctrl', 'Shift', 'N']}
          onSelect={() => console.log('Add note')}
        />
        <ContextMenu>
          <ContextMenuTriggerItem
            label="Turn into"
            icon={<Icon name="turn-into" />}
          />
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
          icon={<Icon name="link" />}
          keyboardShortcut={['Ctrl', 'Shift', 'C']}
          onSelect={() => console.log('Copy link')}
        />
        <ContextMenuItem
          label="Move to"
          icon={<Icon name="arrow-up-right" />}
          keyboardShortcut={['Ctrl', 'M']}
          onSelect={() => console.log('Move to')}
          tooltipTitle="Move drop to another topic"
        />
        <ContextMenuItem
          label="Add to"
          icon={<Icon name="inside" />}
          keyboardShortcut={['Ctrl', 'A']}
          onSelect={() => console.log('Add to')}
          tooltipTitle="Add drop to another topic"
          tooltipDescription="Drops appearing in multiple topics are kept in sync."
        />
      </ContextMenuContent>
    </ContextMenu>
  </div>
);
