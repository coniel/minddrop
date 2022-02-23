import React, { useCallback, useState } from 'react';
import { i18n } from '@minddrop/i18n';
import {
  MenuContents,
  MenuItemConfig,
  generateMenu,
  MenuComponents,
  ContentColor,
  ContentColors,
  ContextMenuItem,
  ContextMenuTriggerItem,
  ContextMenuLabel,
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTriggerItem,
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  ContextMenuTopicSelectionItem,
  DropdownMenuTopicSelectionItem,
  ContextMenuColorSelectionItem,
  DropdownMenuColorSelectionItem,
} from '@minddrop/ui';
import { App, useAppCore, useRootTopics } from '@minddrop/app';
import { Topics } from '@minddrop/topics';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { generateTopicSelectionMenu } from '../generateTopicSelectionMenu';

// Components used to generate a context menu
const ContextMenuComponents: MenuComponents = {
  Item: ContextMenuItem,
  TriggerItem: ContextMenuTriggerItem,
  Label: ContextMenuLabel,
  Menu: ContextMenu,
  MenuContent: ContextMenuContent,
  Separator: ContextMenuSeparator,
  TopicSelectionItem: ContextMenuTopicSelectionItem,
  ColorSelectionItem: ContextMenuColorSelectionItem,
};

// Components used to generate a dropdown menu
const DropdownMenuComponents: MenuComponents = {
  Item: DropdownMenuItem,
  TriggerItem: DropdownMenuTriggerItem,
  Label: DropdownMenuLabel,
  Menu: DropdownMenu,
  MenuContent: DropdownMenuContent,
  Separator: DropdownMenuSeparator,
  TopicSelectionItem: DropdownMenuTopicSelectionItem,
  ColorSelectionItem: DropdownMenuColorSelectionItem,
};

export interface DropMenuProps {
  /**
   * The type of menu to render. Determines which MenuItem
   * components are used under the hood.
   */
  menuType: 'dropdown' | 'context';

  /**
   * The ID of the drop.
   */
  drop: string;

  /**
   * The ID of the parent topic.
   */
  topic: string;

  /**
   * Callback fired when the edit option is selected.
   * If omitted, the edit option will not be displayed.
   */
  onSelectEdit?: MenuItemConfig['onSelect'];
}

/**
 * Generates the contents of a drop's context/dropdown
 * menu.
 *
 * @param core A MindDrop core instance.
 * @param topic The parent topic of the drop.
 * @param drop The drop for which the menu is being generated.
 * @returns Menu item configs.
 */
export const DropMenu: React.FC<DropMenuProps> = ({
  menuType,
  topic,
  drop,
  onSelectEdit,
}) => {
  const core = useAppCore();
  const rootTopicIds = useRootTopics().map((topic) => topic.id);
  let items: MenuContents = [];

  const handleSelectColor = useCallback((color: ContentColor | 'default') => {
    // Get selected drops
    const selectedDrops = App.getSelectedDrops();

    // Update color on selected drops
    Object.keys(selectedDrops).forEach((dropId) => {
      Drops.update(core, dropId, {
        color: color === 'default' ? FieldValue.delete() : color,
      });
    });
  }, []);

  const handleSelectMoveToTopic = useCallback(
    (event: Event, selectedTopicId: string) => {
      // Get selected drops
      const selectedDrops = App.getSelectedDrops();

      // Move selected drops to the selected topic
      Topics.moveDrops(
        core,
        topic,
        selectedTopicId,
        Object.keys(selectedDrops),
      );

      // Unselect the drops
      App.clearSelectedDrops(core);
    },
    [core, topic],
  );

  const handleSelectAddToTopic = useCallback(
    (event: Event, selectedTopicId: string) => {
      // Get selected drops
      const selectedDrops = App.getSelectedDrops();

      // Add selected drops to the selected topic
      Topics.addDrops(core, selectedTopicId, Object.keys(selectedDrops));
    },
    [core],
  );

  const handleDuplicate = useCallback(() => {
    // Get selected drops
    const selectedDrops = App.getSelectedDrops();

    // Duplicate selected drops
    const duplicates = Drops.duplicate(core, Object.keys(selectedDrops));

    // Add duplicated drops to topic
    Topics.addDrops(core, topic, Object.keys(duplicates));
  }, [topic]);

  const handleArchive = useCallback(() => {
    // Get selected drops
    const selectedDrops = App.getSelectedDrops();

    // Archive selected drops
    Object.keys(selectedDrops).forEach((dropId) => {
      Drops.archive(core, dropId);
    });

    // Unselect the drops
    App.clearSelectedDrops(core);
  }, [topic]);

  const handleDelete = useCallback(() => {
    // Get selected drops
    const selectedDrops = App.getSelectedDrops();

    // Delete selected drops
    Object.keys(selectedDrops).forEach((dropId) => {
      Drops.delete(core, dropId);
    });

    // Unselect the drops
    App.clearSelectedDrops(core);
  }, [topic]);

  if (onSelectEdit) {
    items.push({
      type: 'menu-item',
      label: i18n.t('edit'),
      onSelect: onSelectEdit,
      icon: 'edit',
    });
  }

  items = [
    ...items,
    {
      type: 'menu-item',
      label: i18n.t('color'),
      icon: 'color-palette',
      submenuContentClass: 'color-selection-submenu',
      submenu: ContentColors.map((color) => ({
        type: 'menu-color-selection-item',
        color: color.value,
        onSelect: () => handleSelectColor(color.value),
      })),
    },
    {
      type: 'menu-separator',
    },
    {
      type: 'menu-item',
      label: i18n.t('moveTo'),
      icon: 'arrow-up-right',
      submenuContentClass: 'topic-selection-submenu',
      submenu: generateTopicSelectionMenu(
        rootTopicIds,
        handleSelectMoveToTopic,
      ),
    },
    {
      type: 'menu-item',
      label: i18n.t('addTo'),
      icon: 'inside',
      submenuContentClass: 'topic-selection-submenu',
      submenu: generateTopicSelectionMenu(rootTopicIds, handleSelectAddToTopic),
    },
    {
      type: 'menu-separator',
    },
    {
      type: 'menu-item',
      label: i18n.t('duplicate'),
      icon: 'duplicate',
      onSelect: handleDuplicate,
      keyboardShortcut: ['Ctrl', 'D'],
    },
    {
      type: 'menu-item',
      label: i18n.t('archive'),
      icon: 'archive',
      onSelect: handleArchive,
      keyboardShortcut: ['Shift', 'Del'],
    },
    {
      type: 'menu-item',
      label: i18n.t('delete'),
      icon: 'trash',
      keyboardShortcut: ['Del'],
      onSelect: handleDelete,
    },
  ];

  const content = generateMenu(
    menuType === 'context' ? ContextMenuComponents : DropdownMenuComponents,
    items,
  );

  return <>{content}</>;
};