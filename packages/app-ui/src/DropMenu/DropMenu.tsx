import React, { useCallback } from 'react';
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
import { App, useAppCore } from '@minddrop/app';
import { Topics } from '@minddrop/topics';
import { Selection } from '@minddrop/selection';
import { Drops } from '@minddrop/drops';
import { FieldValue } from '@minddrop/utils';
import { generateTopicSelectionMenu } from '../utils';
import './DropMenu.css';

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
  dropId: string;

  /**
   * The ID of the parent topic.
   */
  topicId: string;

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
  topicId,
  dropId,
  onSelectEdit,
}) => {
  const core = useAppCore();
  const drop = Drops.get(dropId);
  const rootTopicIds = App.getRootTopics().map((topic) => topic.id);
  let items: MenuContents = [];

  const handleSelectColor = useCallback(
    (color: ContentColor | 'default') => {
      // Get selected drop IDs
      const selectedDrops = Selection.getIds('drops:drop');

      // Update color on selected drops
      selectedDrops.forEach((id) => {
        Drops.update(core, id, {
          color: color === 'default' ? FieldValue.delete() : color,
        });
      });
    },
    [core],
  );

  const handleSelectMoveToTopic = useCallback(
    (event: Event, selectedTopicId: string) => {
      // Get selected drop IDs
      const selectedDrops = Selection.getIds('drops:drop');

      // Move selected drops to the selected topic
      Topics.moveDrops(core, topicId, selectedTopicId, selectedDrops);

      // Clear the selection
      Selection.clear(core);
    },
    [core, topicId],
  );

  const handleSelectAddToTopic = useCallback(
    (event: Event, selectedTopicId: string) => {
      // Get selected drop IDs
      const selectedDrops = Selection.getIds('drops:drop');

      // Add selected drops to the selected topic
      Topics.addDrops(core, selectedTopicId, selectedDrops);
    },
    [core],
  );

  const handleDuplicate = useCallback(() => {
    // Get selected drop IDs
    const selectedDrops = Selection.getIds('drops:drop');

    // Duplicate selected drops
    const duplicates = Drops.duplicate(core, selectedDrops);

    // Add duplicated drops to topic
    Topics.addDrops(core, topicId, Object.keys(duplicates));
  }, [core, topicId]);

  const handleArchive = useCallback(() => {
    // Get selected drop IDs
    const selectedDrops = Selection.getIds('drops:drop');

    // Archive selected drops
    Topics.archiveDrops(core, topicId, selectedDrops);

    // Clear the selection
    Selection.clear(core);
  }, [core, topicId]);

  const handleArchiveEverywhere = useCallback(() => {
    // Get selected drop IDs
    const dropIds = Selection.getIds('drops:drop');
    const drops = Drops.get(dropIds);

    // Generate a map of affected topics and their affected drops
    const topicsDropsMap = Object.values(drops).reduce((map, drop) => {
      const updatedMap = { ...map };
      drop.parents
        .filter((parent) => parent.resource === 'topics:topic')
        .forEach((parent) => {
          if (map[parent.id]) {
            updatedMap[parent.id].push(drop.id);
          } else {
            updatedMap[parent.id] = [drop.id];
          }
        });

      return updatedMap;
    }, {});

    // Archive the drops in all of their respective topics
    Object.keys(topicsDropsMap).forEach((tId) => {
      Topics.archiveDrops(core, tId, topicsDropsMap[tId]);
    });

    // Clear the selection
    Selection.clear(core);
  }, [core]);

  const handleDelete = useCallback(() => {
    // Get selected drop IDs
    const selectedDrops = Selection.getIds('drops:drop');

    // Delete selected drops
    selectedDrops.forEach((id) => {
      Drops.delete(core, id);
    });

    // Clear the selection
    Selection.clear(core);
  }, [core]);

  const handleRemoveFromTopic = useCallback(() => {
    // Get selected drop IDs
    const selectedDrops = Selection.getIds('drops:drop');

    // Remove the selected drop from the topic
    Topics.removeDrops(core, topicId, selectedDrops);

    // Clear the selection
    Selection.clear(core);
  }, [core, topicId]);

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
  ];

  const archiveItem: MenuItemConfig = {
    type: 'menu-item',
    label: i18n.t('archive'),
    icon: 'archive',
    onSelect: handleArchive,
    keyboardShortcut: ['Shift', 'Del'],
  };

  const deleteItem: MenuItemConfig = {
    type: 'menu-item',
    label: i18n.t('delete'),
    icon: 'trash',
    keyboardShortcut: ['Del'],
    onSelect: handleDelete,
  };

  // If the drop has multiple parent topics, add a secondary
  // action to archive/delete the drop in all parent topics.
  if (
    drop.parents.filter((parent) => parent.resource === 'topics:topic').length >
    1
  ) {
    // Archive item modifications
    archiveItem.secondaryLabel = i18n.t('archiveEverywhere');
    archiveItem.secondaryOnSelect = handleArchiveEverywhere;
    archiveItem.tooltipTitle = i18n.t('archiveInTopic');
    archiveItem.tooltipDescription = (
      <span>
        <span style={{ fontWeight: 'bold' }}>{i18n.t('shiftClick')}</span>{' '}
        {i18n.t('toArchiveInAllTopics')}
      </span>
    );

    // Delete item modifications
    deleteItem.onSelect = handleRemoveFromTopic;
    deleteItem.secondaryLabel = i18n.t('deleteEverywhere');
    deleteItem.secondaryOnSelect = handleDelete;
    deleteItem.tooltipTitle = i18n.t('deleteFromTopic');
    deleteItem.tooltipDescription = (
      <span>
        <span style={{ fontWeight: 'bold' }}>{i18n.t('shiftClick')}</span>{' '}
        {i18n.t('toDeleteFromAllTopics')}
      </span>
    );
  }

  items.push(archiveItem);
  items.push(deleteItem);

  const content = generateMenu(
    menuType === 'context' ? ContextMenuComponents : DropdownMenuComponents,
    items,
  );

  return <>{content.map((item) => item)}</>;
};
