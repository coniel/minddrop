/* eslint-disable no-console */
import React from 'react';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { IconButton } from '../IconButton';
import { ContentColors } from '../constants';

export default {
  title: 'ui/DropdownMenu',
  component: DropdownMenu,
};

export const Default: React.FC = () => (
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
        {
          type: 'menu-item',
          label: 'Add to',
          icon: 'inside',
          onSelect: () => console.log('Add to'),
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
        {
          type: 'menu-separator',
        },
        {
          type: 'menu-item',
          label: 'Archive',
          icon: 'archive',
          onSelect: () => console.log('Archive'),
          secondaryLabel: 'Archive everywhere',
          secondaryOnSelect: () => console.log('Archive everywhere'),
          tooltipTitle: 'Archive drop',
          keyboardShortcut: ['Shift', 'Del'],
          tooltipDescription: (
            <span>
              <span style={{ fontWeight: 'bold' }}>Shift + Click</span> to
              archive in all topics
            </span>
          ),
        },
        {
          type: 'menu-item',
          label: 'Delete',
          icon: 'trash',
          onSelect: () => console.log('Delete'),
          secondaryLabel: 'Delete everywhere',
          secondaryOnSelect: () => console.log('Delete everywhere'),
          keyboardShortcut: ['Del'],
          tooltipTitle: 'Delete drop',
          tooltipDescription: (
            <span>
              <span style={{ fontWeight: 'bold' }}>Shift + Click</span> to
              delete from all topics
            </span>
          ),
        },
      ]}
    />
  </DropdownMenu>
);
