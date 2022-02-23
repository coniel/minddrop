/* eslint-disable no-console */
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContentColors,
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
            submenuContentClass: 'color-selection-submenu',
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
            tooltipTitle: 'Copy drop link',
            tooltipDescription:
              'Paste the link into other drops to create a network or related information.',
          },
          {
            type: 'menu-item',
            label: 'Move to',
            icon: 'arrow-up-right',
            onSelect: () => console.log('Move to'),
            submenuContentClass: 'topic-selection-submenu',
            submenu: [
              {
                type: 'menu-topic-selection-item',
                label: 'Sailing',
                onSelect: () => console.log("Move to 'Sailing'"),
                subtopics: [
                  {
                    type: 'menu-topic-selection-item',
                    label: 'Navigation',
                    onSelect: () => console.log("Move to 'Navigation'"),
                    subtopics: [
                      {
                        type: 'menu-topic-selection-item',
                        label: 'Coastal navigation',
                        onSelect: () =>
                          console.log("Move to 'Coastal navigation'"),
                        subtopics: [],
                      },
                      {
                        type: 'menu-topic-selection-item',
                        label: 'Offshore navigation',
                        onSelect: () =>
                          console.log("Move to 'Offshore navigation'"),
                        subtopics: [],
                      },
                    ],
                  },
                  {
                    type: 'menu-topic-selection-item',
                    id: 'anchoring',
                    label: 'Anchoring',
                    onSelect: () => console.log("Move to 'Anchoring'"),
                    subtopics: [],
                  },
                  {
                    type: 'menu-topic-selection-item',
                    label: 'Sailboats',
                    onSelect: () => console.log("Move to 'Sailboats'"),
                    subtopics: [],
                  },
                ],
              },
              {
                type: 'menu-topic-selection-item',
                label: 'Home',
                onSelect: () => console.log("Move to 'Home'"),
                subtopics: [],
              },
              {
                type: 'menu-topic-selection-item',
                label: 'Tea',
                onSelect: () => console.log("Move to 'Tea'"),
                subtopics: [],
              },
              {
                type: 'menu-topic-selection-item',
                label: 'Work',
                onSelect: () => console.log("Move to 'work'"),
                subtopics: [],
              },
              {
                type: 'menu-topic-selection-item',
                label: 'Japanese',
                onSelect: () => console.log("Move to 'Japanese'"),
                subtopics: [],
              },
            ],
          },
        ]}
      />
    </ContextMenu>
  </div>
);

export default ContextMenuDemo;
