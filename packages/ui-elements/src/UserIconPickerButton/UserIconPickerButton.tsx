import React, { useCallback, useEffect } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  ContentIconName,
  EmojiSkinTone,
  Icons,
  UserIcon as UserIconDef,
  UserIconType,
  useIcon,
} from '@minddrop/icons';
import { useToggle } from '@minddrop/utils';
import { IconButton } from '../IconButton';
import { IconPicker } from '../IconPicker';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverContentProps,
  PopoverPortal,
} from '../Popover';
import { UserIcon } from '../UserIcon';
import { ContentColor } from '../types';

export interface UserIconPickerButtonProps {
  /**
   * The current icon stringified.
   */
  icon?: string;

  /**
   * The default icon to use if no icon is provided.
   */
  defaultIcon: UserIconDef;

  /**
   * Callback fired when an icon is selected.
   */
  onSelect?: (icon: string) => void;

  /**
   * Callback fired when the icon selection is cleared.
   */
  onClear?: () => void;

  /**
   * Whether to close the icon selection popover when an icon is selected.
   * Defaults to `true`.
   */
  closeOnSelect?: boolean;

  /**
   * Whether to show the icon selection popover. Used to control the popover
   * state externally.
   */
  showIconSelection?: boolean;

  /**
   * Callback fired when the icon selection popover is shown or hidden.
   * Used to control the popover state externally.
   */
  onShowIconSelectionChange?: (value: boolean) => void;

  /**
   * The side of the popover which will be aligned to the button.
   */
  popoverSide?: PopoverContentProps['side'];

  /**
   * The offset of the popover from the button.
   */
  popoverSideOffset?: PopoverContentProps['sideOffset'];

  /**
   * The alignment of the popover relative to the button.
   */
  popoverAlign?: PopoverContentProps['align'];
}

export const UserIconPickerButton = React.forwardRef<
  HTMLButtonElement,
  UserIconPickerButtonProps
>(
  (
    {
      icon: stringIcon,
      defaultIcon,
      showIconSelection = false,
      onShowIconSelectionChange,
      onClear,
      onSelect,
      closeOnSelect = true,
      popoverSide = 'top',
      popoverAlign = 'start',
      popoverSideOffset = 4,
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const { icon, color, skinTone } = useIcon(stringIcon, defaultIcon);
    const [pickerPopoverOpen, togglePickerPopoverOpen, setPickerPopoverOpen] =
      useToggle(showIconSelection);

    useEffect(() => {
      setPickerPopoverOpen(showIconSelection);
    }, [setPickerPopoverOpen, showIconSelection]);

    const handleCloseIconSelection = useCallback(() => {
      if (onShowIconSelectionChange) {
        onShowIconSelectionChange(false);
      }

      setPickerPopoverOpen(false);
    }, [onShowIconSelectionChange, setPickerPopoverOpen]);

    const handleSelectIcon = useCallback(
      (icon: ContentIconName, color: ContentColor) => {
        if (onSelect) {
          onSelect(
            Icons.stringify({ type: UserIconType.ContentIcon, icon, color }),
          );

          if (closeOnSelect) {
            handleCloseIconSelection();
          }
        }
      },
      [onSelect, closeOnSelect, handleCloseIconSelection],
    );

    const handleSelectEmoji = useCallback(
      (emoji: string, skinTone: EmojiSkinTone) => {
        if (onSelect) {
          onSelect(
            Icons.stringify({
              type: UserIconType.Emoji,
              icon: emoji,
              skinTone,
            }),
          );

          if (closeOnSelect) {
            handleCloseIconSelection();
          }
        }
      },
      [onSelect, closeOnSelect, handleCloseIconSelection],
    );

    const handleSelectIconColor = useCallback(
      (color: ContentColor) => {
        if (onSelect && stringIcon) {
          onSelect(Icons.applyColor(stringIcon, color));
        }
      },
      [onSelect, stringIcon],
    );

    const handleClear = useCallback(() => {
      if (onClear) {
        onClear();
      }
    }, [onClear]);

    return (
      <Popover open={pickerPopoverOpen}>
        <PopoverAnchor asChild>
          <IconButton
            size="medium"
            ref={ref}
            label={t('iconPicker.change')}
            className="user-icon-picker"
            onClick={togglePickerPopoverOpen}
          >
            <UserIcon icon={stringIcon} />
          </IconButton>
        </PopoverAnchor>
        <PopoverPortal>
          <PopoverContent
            style={{ borderRadius: 8 }}
            side={popoverSide}
            sideOffset={popoverSideOffset}
            align={popoverAlign}
            collisionPadding={{ left: 14 }}
            onEscapeKeyDown={handleCloseIconSelection}
            onPointerDownOutside={handleCloseIconSelection}
          >
            <IconPicker
              defaultPicker={icon.type}
              defaultIconColor={color}
              defaultEmojiSkinTone={skinTone}
              onClear={handleClear}
              onSelectIcon={handleSelectIcon}
              onSelectIconColor={handleSelectIconColor}
              onSelectEmoji={handleSelectEmoji}
            />
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    );
  },
);

UserIconPickerButton.displayName = 'UserIconPickerButton';
