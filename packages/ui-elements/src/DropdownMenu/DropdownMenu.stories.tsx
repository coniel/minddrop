import React, { useState } from 'react';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuContent } from './DropdownMenuContent';
import { DropdownMenuTrigger } from './DropdownMenuTrigger';
import { DropdownMenuRadioItem } from './DropdownMenuRadioItem';
import { DropdownMenuRadioGroup } from './DropdownMenuRadioGroup';
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
          icon: 'text',
          onSelect: () => console.log('Add title'),
          keyboardShortcut: ['Ctrl', 'T'],
        },
        {
          type: 'menu-item',
          label: 'Add note',
          icon: 'edit-2',
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
          icon: 'refresh',
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
          icon: 'diagonal-arrow-right-up',
          onSelect: () => console.log('Move to'),
          submenuContentClass: 'topic-selection-submenu',
          submenu: [
            {
              id: 'sailing',
              type: 'menu-topic-selection-item',
              label: 'Sailing',
              onSelect: () => console.log("Move to 'Sailing'"),
              subtopics: [
                {
                  id: 'navigation',
                  type: 'menu-topic-selection-item',
                  label: 'Navigation',
                  onSelect: () => console.log("Move to 'Navigation'"),
                  subtopics: [
                    {
                      id: 'coastal-navigation',
                      type: 'menu-topic-selection-item',
                      label: 'Coastal navigation',
                      onSelect: () =>
                        console.log("Move to 'Coastal navigation'"),
                      subtopics: [],
                    },
                    {
                      id: 'offshore-navigation',
                      type: 'menu-topic-selection-item',
                      label: 'Offshore navigation',
                      onSelect: () =>
                        console.log("Move to 'Offshore navigation'"),
                      subtopics: [],
                    },
                  ],
                },
                {
                  id: 'anchoring',
                  type: 'menu-topic-selection-item',
                  label: 'Anchoring',
                  onSelect: () => console.log("Move to 'Anchoring'"),
                  subtopics: [],
                },
                {
                  id: 'sailboats',
                  type: 'menu-topic-selection-item',
                  label: 'Sailboats',
                  onSelect: () => console.log("Move to 'Sailboats'"),
                  subtopics: [],
                },
              ],
            },
            {
              id: 'home',
              type: 'menu-topic-selection-item',
              label: 'Home',
              onSelect: () => console.log("Move to 'Home'"),
              subtopics: [],
            },
            {
              id: 'tea',
              type: 'menu-topic-selection-item',
              label: 'Tea',
              onSelect: () => console.log("Move to 'Tea'"),
              subtopics: [],
            },
            {
              id: 'work',
              type: 'menu-topic-selection-item',
              label: 'Work',
              onSelect: () => console.log("Move to 'work'"),
              subtopics: [],
            },
            {
              id: 'japanese',
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
          icon: 'corner-down-right',
          onSelect: () => console.log('Add to'),
          submenuContentClass: 'topic-selection-submenu',
          submenu: [
            {
              id: 'sailing',
              type: 'menu-topic-selection-item',
              label: 'Sailing',
              onSelect: () => console.log("Add to 'Sailing'"),
              subtopics: [
                {
                  id: 'navigation',
                  type: 'menu-topic-selection-item',
                  label: 'Navigation',
                  onSelect: () => console.log("Add to 'Navigation'"),
                  subtopics: [
                    {
                      id: 'coastal-navigation',
                      type: 'menu-topic-selection-item',
                      label: 'Coastal navigation',
                      onSelect: () =>
                        console.log("Add to 'Coastal navigation'"),
                      subtopics: [],
                    },
                    {
                      id: 'offshore-navigation',
                      type: 'menu-topic-selection-item',
                      label: 'Offshore navigation',
                      onSelect: () =>
                        console.log("Add to 'Offshore navigation'"),
                      subtopics: [],
                    },
                  ],
                },
                {
                  id: 'anchoring',
                  type: 'menu-topic-selection-item',
                  label: 'Anchoring',
                  onSelect: () => console.log("Add to 'Anchoring'"),
                  subtopics: [],
                },
                {
                  id: 'sailboats',
                  type: 'menu-topic-selection-item',
                  label: 'Sailboats',
                  onSelect: () => console.log("Add to 'Sailboats'"),
                  subtopics: [],
                },
              ],
            },
            {
              id: 'home',
              type: 'menu-topic-selection-item',
              label: 'Home',
              onSelect: () => console.log("Add to 'Home'"),
              subtopics: [],
            },
            {
              id: 'tea',
              type: 'menu-topic-selection-item',
              label: 'Tea',
              onSelect: () => console.log("Add to 'Tea'"),
              subtopics: [],
            },
            {
              id: 'work',
              type: 'menu-topic-selection-item',
              label: 'Work',
              onSelect: () => console.log("Add to 'work'"),
              subtopics: [],
            },
            {
              id: 'japanese',
              type: 'menu-topic-selection-item',
              label: 'Japanese',
              onSelect: () => console.log("Add to 'Japanese'"),
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

export const RadioMenu: React.FC = () => {
  const [value, setValue] = useState('light');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton icon="sun" label="Drop options" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" style={{ width: 240 }}>
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          <DropdownMenuRadioItem label="Use system setting" value="system" />
          <DropdownMenuRadioItem label="Light" value="light" />
          <DropdownMenuRadioItem label="Dark" value="dark" />
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
