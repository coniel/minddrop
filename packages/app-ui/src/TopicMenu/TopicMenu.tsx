import React, { useCallback } from 'react';
import { Topic, Topics } from '@minddrop/topics';
import {
  MenuContents,
  generateMenu,
  MenuComponents,
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
  MenuItemConfig,
  SubmenuContents,
} from '@minddrop/ui';
import { i18n } from '@minddrop/i18n';
import { App, useAppCore } from '@minddrop/app';
import { generateTopicSelectionMenu } from '../utils';
import './TopicMenu.css';

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

export interface TopicMenuProps {
  /**
   * The type of menu to render. Determines which MenuItem
   * components are used under the hood.
   */
  menuType: 'dropdown' | 'context';

  /**
   * Array of topic IDs leading up to and including the
   * current topic.
   */
  trail: string[];

  /**
   * Callback fired after a subtopic is added using the
   * 'Add subtopic' menu item.
   *
   * @param subtopic The newly created subtopic.
   */
  onAddSubtopic?(subtopic: Topic): void;

  /**
   * Callback fired when the topic is archived using the
   * 'Archive' option.
   */
  onArchive?(): void;

  /**
   * Callback fired when the topic is deleted using the
   * 'Delete' option.
   *
   * @param topic The deleted topic.
   */
  onDelete?(): void;

  /**
   * Callback fired when the 'Rename' menu item is clicked.
   *
   * @param topic The topic to rename.
   */
  onRename?(): void;
}

export const TopicMenu: React.FC<TopicMenuProps> = ({
  menuType,
  trail,
  onAddSubtopic,
  onArchive,
  onDelete,
  onRename,
}) => {
  const core = useAppCore();
  // The last item in the trail is the current topic ID
  const topic = Topics.get(trail.slice(-1)[0]);
  // Get the root level topic IDs
  const rootTopicIds = App.getRootTopics().map((topic) => topic.id);
  // The topic's parent topics
  const parentTopics = topic.parents.filter(
    (parent) => parent.resource === 'topics:topic',
  );
  // Does the topic appear at the root level
  const isRootTopic = rootTopicIds.includes(topic.id);

  const handleAddSubtopic = useCallback(() => {
    // Create the subtopic
    let subtopic = App.createTopic(core);

    // Add the new subtopic to the topic
    Topics.addSubtopics(core, topic.id, [subtopic.id]);

    // Get the updated subtopic
    subtopic = Topics.get(subtopic.id);

    if (onAddSubtopic) {
      // Call the onAddSubtopic callback
      onAddSubtopic(subtopic);
    }
  }, [topic.id, onAddSubtopic]);

  const handleAddTo = useCallback(
    (event: Event, selectedTopicId: string) => {
      // Add topic as sutopic in selectd topic
      Topics.addSubtopics(core, selectedTopicId, [topic.id]);
    },
    [topic.id],
  );

  const handleAddToRoot = useCallback(
    (event: Event) => {
      // Add topic to the root level
      App.addRootTopics(core, [topic.id]);
    },
    [topic.id],
  );

  const handleMoveTo = useCallback(
    (event: Event, selectedTopicId: string) => {
      if (isRootTopic) {
        // Move the topic from the root level into the selected topic
        App.moveRootTopicsToParentTopic(core, selectedTopicId, [topic.id]);
      } else {
        // Get the parent topic ID
        const [parentId] = trail.slice(-2);

        // Move the topic from its parent topic into the selected topic
        Topics.moveSubtopics(core, parentId, selectedTopicId, [topic.id]);
      }
    },
    [trail, topic.id],
  );

  const handleMoveToRoot = useCallback(() => {
    // Get the parent topic ID
    const [parentId] = trail.slice(-2);

    // Move the topic to the root level
    App.moveSubtopicsToRoot(core, parentId, [topic.id]);
  }, [trail, topic.id]);

  const handleArchive = useCallback(() => {
    if (trail.length === 1) {
      // Topic is a root level topic, archive it at the root level
      App.archiveRootTopics(core, trail);
    } else {
      // Topic is a subtopic, archive it in its parent
      const [parentId, subtopicId] = trail.slice(-2);
      Topics.archiveSubtopics(core, parentId, [subtopicId]);
    }

    if (onArchive) {
      // Call the onArchiveCallback
      onArchive();
    }
  }, [trail, onArchive]);

  const handleArchiveEverywhere = useCallback(() => {
    if (isRootTopic) {
      // Archive the topic at the root level if present there
      App.archiveRootTopics(core, [topic.id]);
    }

    // Archive in parent topics
    parentTopics.forEach((parent) => {
      Topics.archiveSubtopics(core, parent.id, [topic.id]);
    });

    if (onArchive) {
      // Call the onArchiveCallback
      onArchive();
    }
  }, [parentTopics, isRootTopic, topic.id, onArchive]);

  const handleRemove = useCallback(() => {
    if (trail.length === 1) {
      // Topic is a root level topic, remove it from the root level
      App.removeRootTopics(core, trail);
    } else {
      // Topic is a subtopic, remove it from its parent topic
      const [parentTopicId, subtopicId] = trail.slice(-2);
      Topics.removeSubtopics(core, parentTopicId, [subtopicId]);
    }

    if (onDelete) {
      onDelete();
    }
  }, [trail, onDelete]);

  const handleDelete = useCallback(() => {
    // Delete the topic
    Topics.delete(core, topic.id);

    if (onDelete) {
      // Call the onDelete callback
      onDelete();
    }
  }, [topic.id, onDelete]);

  let items: MenuContents = [
    // Add subtopic
    {
      type: 'menu-item',
      label: i18n.t('addSubtopic'),
      onSelect: handleAddSubtopic,
      icon: 'add',
    },
  ];

  if (onRename) {
    // Add 'Rename' item if there an onRename callback was provided
    items.push({
      type: 'menu-item',
      label: i18n.t('rename'),
      onSelect: onRename,
      icon: 'edit',
    });
  }

  // Submenu for the 'Add to' item
  const addToSubmenu: SubmenuContents = generateTopicSelectionMenu(
    rootTopicIds,
    handleAddTo,
    [topic.id],
  );
  // Submenu for the 'Move to' item
  const moveToSubmenu: SubmenuContents = generateTopicSelectionMenu(
    rootTopicIds,
    handleMoveTo,
    [topic.id],
  );

  // If the topic is not a root level topic, add a 'Add/Move to Topics'
  // item to the above sumbenus.
  if (!isRootTopic) {
    addToSubmenu.push({
      type: 'menu-item',
      label: i18n.t('addToTopics'),
      tooltipTitle: i18n.t('addToTopicsTooltip'),
      onSelect: handleAddToRoot,
    });

    moveToSubmenu.push({
      type: 'menu-item',
      label: i18n.t('moveToTopics'),
      tooltipTitle: i18n.t('moveToTopicsTooltip'),
      onSelect: handleMoveToRoot,
    });
  }

  items = [
    ...items,
    {
      type: 'menu-separator',
    },
    // Add to
    {
      type: 'menu-item',
      label: i18n.t('addTo'),
      icon: 'inside',
      submenuContentClass: 'topic-selection-submenu',
      submenu: addToSubmenu,
    },
    // Move to
    {
      type: 'menu-item',
      label: i18n.t('moveTo'),
      icon: 'arrow-up-right',
      submenuContentClass: 'topic-selection-submenu',
      submenu: moveToSubmenu,
    },
    {
      type: 'menu-separator',
    },
  ];

  // Archive item
  const archiveItem: MenuItemConfig = {
    type: 'menu-item',
    label: i18n.t('archive'),
    onSelect: handleArchive,
    icon: 'archive',
  };
  // Delete item
  const deleteItem: MenuItemConfig = {
    type: 'menu-item',
    label: i18n.t('delete'),
    onSelect: handleDelete,
    icon: 'trash',
  };

  // If the topic has multiple parents or is a root level topic as well as
  // a subtopic in at least one parent topic.
  if (parentTopics.length > 1 || (isRootTopic && parentTopics.length)) {
    // Add 'Archive everywhere' secondary action
    archiveItem.secondaryLabel = i18n.t('archiveEverywhere');
    archiveItem.secondaryOnSelect = handleArchiveEverywhere;
    archiveItem.tooltipTitle = i18n.t('archiveInTopic');
    archiveItem.tooltipDescription = (
      <span>
        <span style={{ fontWeight: 'bold' }}>{i18n.t('shiftClick')}</span>{' '}
        {i18n.t('toArchiveInAllTopics')}
      </span>
    );

    // Add 'Delete everywhere' secondary action
    deleteItem.secondaryLabel = i18n.t('deleteEverywhere');
    deleteItem.secondaryOnSelect = handleDelete;
    deleteItem.tooltipTitle = i18n.t('deleteFromTopic');
    deleteItem.tooltipDescription = (
      <span>
        <span style={{ fontWeight: 'bold' }}>{i18n.t('shiftClick')}</span>{' '}
        {i18n.t('toDeleteFromAllTopics')}
      </span>
    );
    // Change primary action from delete to remove
    deleteItem.onSelect = handleRemove;
  }

  // Add 'Archive' item
  items.push(archiveItem);
  // Add 'Delete' item
  items.push(deleteItem);

  // Generate the menu contents using the appropirate components
  const content = generateMenu(
    menuType === 'context' ? ContextMenuComponents : DropdownMenuComponents,
    items,
  );

  return <>{content}</>;
};
