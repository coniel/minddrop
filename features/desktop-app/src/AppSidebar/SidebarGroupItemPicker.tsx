import { useCallback, useState } from 'react';
import { SidebarGroups } from '@minddrop/app';
import { EntityGroup } from '@minddrop/entity-groups';
import { useTranslation } from '@minddrop/i18n';
import { EntitySearchMenu } from '@minddrop/ui-components';
import { EntityGroupAddPopoverContext } from '@minddrop/ui-entity-groups';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
} from '@minddrop/ui-primitives';
import './SidebarGroupItemPicker.css';

export interface SidebarGroupItemPickerProps
  extends EntityGroupAddPopoverContext {
  /**
   * The group items are added to.
   */
  group: EntityGroup;
}

/**
 * Renders the searchable picker opened by a group's add button,
 * listing the entities a sidebar group can hold, minus the ones it
 * already holds.
 */
export const SidebarGroupItemPicker: React.FC<SidebarGroupItemPickerProps> = ({
  group,
  anchor,
  open,
  onOpenChange,
}) => {
  const [openCount, setOpenCount] = useState(0);
  const { t } = useTranslation();

  // Start the menu afresh each time the picker opens, so it does
  // not reopen on the search it was left with.
  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpenCount((count) => count + 1);
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  // Add the picked entity to the group
  function handleSelect(itemId: string) {
    SidebarGroups.addItem(group.id, itemId);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverPortal>
        <PopoverPositioner side="bottom" align="start" anchor={anchor}>
          {/* A popover rather than a dropdown menu: a menu opened
              by something other than a press of its own trigger
              closes as soon as the pointer leaves it. */}
          <PopoverContent className="sidebar-group-item-picker">
            <EntitySearchMenu
              key={openCount}
              types={SidebarGroups.constants.ItemTypes}
              excludeIds={group.items}
              onSelect={handleSelect}
              searchPlaceholder="desktopApp.sidebarGroups.picker.searchPlaceholder"
              emptyText={t('desktopApp.sidebarGroups.picker.empty')}
            />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};
