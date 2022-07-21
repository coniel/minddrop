import React, { useCallback } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  ContextMenuItem,
  ContextMenuContent,
  ContextMenuLabel,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
} from '@minddrop/ui';
import { useAppCore, useTopicDropConfigs } from '@minddrop/app';
import { Topics } from '@minddrop/topics';
import { Drops } from '@minddrop/drops';
import './AddDropMenu.css';

// Components used to generate a context menu
const ContextMenuComponents = {
  Item: ContextMenuItem,
  MenuContent: ContextMenuContent,
  Label: ContextMenuLabel,
};

// Components used to generate a dropdown menu
const DropdownMenuComponents = {
  Item: DropdownMenuItem,
  MenuContent: DropdownMenuContent,
  Label: DropdownMenuLabel,
};

export interface AddDropMenuProps {
  /**
   * The type of menu to render. Determines which MenuItem
   * components are used under the hood.
   */
  menuType: 'dropdown' | 'context';

  /**
   * The ID of the topic into which to add the drop.
   */
  topicId: string;
}

export const AddDropMenu: React.FC<AddDropMenuProps> = ({
  topicId,
  menuType,
  ...other
}) => {
  const core = useAppCore();
  const { t } = useTranslation();
  // Get the topic's drop type configs
  const dropConfigs = useTopicDropConfigs(topicId);

  const Components =
    menuType === 'dropdown' ? DropdownMenuComponents : ContextMenuComponents;

  const handleAddDrop = useCallback(
    (type: string) => {
      // Create a drop of the selected type
      const drop = Drops.create(core, type);

      // Add the drop to the topic
      Topics.addDrops(core, topicId, [drop.id]);
    },
    [core, topicId],
  );

  return (
    <Components.MenuContent className="add-drop-menu" {...other}>
      <Components.Label>{t('addDrop')}</Components.Label>
      {dropConfigs.map((config) => (
        <Components.Item
          key={config.type}
          label={config.name}
          description={config.description}
          onSelect={() => handleAddDrop(config.type)}
        />
      ))}
    </Components.MenuContent>
  );
};
