import { useCallback, useEffect } from 'react';
import {
  Collection,
  Collections,
  DefaultCollectionIcon,
} from '@minddrop/collections';
import { ContentColor } from '@minddrop/core';
import {
  ContentIconName,
  EmojiSkinTone,
  Icons,
  UserIconType,
  useIcon,
} from '@minddrop/icons';
import { NavItemIcon } from '@minddrop/ui-desktop';
import {
  IconPicker,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
} from '@minddrop/ui-elements';
import { useToggle } from '@minddrop/utils';

export interface CollectionNavItemIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the NavItemIcon.
   */
  children?: React.ReactNode;
}

export const CollectionNavItemIcon: React.FC<{
  collection: Collection;
  showIconSelection: boolean;
  onShowIconSelectionChange(value: boolean): void;
}> = ({ showIconSelection = false, onShowIconSelectionChange, collection }) => {
  const [pickerPopoverOpen, togglePickerPopoverOpen, setPickerPopoverOpen] =
    useToggle(showIconSelection);
  const { icon, color, skinTone } = useIcon(
    collection.icon,
    DefaultCollectionIcon,
  );

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [setPickerPopoverOpen, showIconSelection]);

  const handleClear = useCallback(() => {
    Collections.update(collection.path, {
      icon: Icons.stringify(DefaultCollectionIcon),
    });
  }, [collection.path]);

  const handleCloseIconSelection = useCallback(() => {
    onShowIconSelectionChange(false);
    setPickerPopoverOpen(false);
  }, [onShowIconSelectionChange, setPickerPopoverOpen]);

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      Collections.update(collection.path, {
        icon: Icons.stringify({ type: UserIconType.ContentIcon, icon, color }),
      }),
    [collection.path],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) =>
      Collections.update(collection.path, {
        icon: Icons.applyColor(
          collection.icon || Icons.stringify(DefaultCollectionIcon),
          color,
        ),
      }),
    [collection],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      Collections.update(collection.path, {
        icon: Icons.stringify({
          type: UserIconType.Emoji,
          icon: emoji,
          skinTone,
        }),
      }),
    [collection.path],
  );

  return (
    <Popover open={pickerPopoverOpen}>
      <PopoverAnchor asChild>
        <NavItemIcon
          defaultIcon={DefaultCollectionIcon}
          icon={collection.icon}
          onClick={togglePickerPopoverOpen}
        />
      </PopoverAnchor>
      <PopoverPortal>
        <PopoverContent
          style={{ borderRadius: 8 }}
          side="top"
          sideOffset={4}
          collisionPadding={{ left: 14 }}
          onEscapeKeyDown={handleCloseIconSelection}
          onPointerDownOutside={handleCloseIconSelection}
        >
          <IconPicker
            defaultPicker={icon.type}
            defaultIconColor={color}
            defaultEmojiSkinTone={skinTone}
            onClear={handleClear}
            onSelectIcon={handleSelectContentIcon}
            onSelectIconColor={handleSelectIconColor}
            onSelectEmoji={handleSelectEmoji}
          />
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
};
