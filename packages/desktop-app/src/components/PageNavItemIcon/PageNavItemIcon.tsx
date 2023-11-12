import { useCreateCallback, useToggle } from '@minddrop/utils';
import { Page } from '@minddrop/pages';
import { useCallback, useEffect, useMemo } from 'react';
import { ContentIconName, EmojiSkinTone, UserIconType } from '@minddrop/icons';
import { ContentColor } from '@minddrop/core';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@minddrop/ui';
import {
  clearPageIcon,
  setPageContentIcon,
  setPageContentIconColor,
  setPageEmoji,
} from '../../api';
import { NavItemIcon } from '../NavItemIcon';
import { IconPicker } from '../IconPicker';

export interface PageNavItemIconProps extends React.HTMLProps<HTMLDivElement> {
  /**
   * The associated page.
   */
  page: Page;

  /**
   * When true, icon selection popup is opened.
   */
  showIconSelection: boolean;

  /**
   * Callback fired when the icon selection popup toggle
   * state changes.
   */
  onShowIconSelectionChange(value: boolean): void;
}

export const PageNavItemIcon: React.FC<PageNavItemIconProps> = ({
  showIconSelection = false,
  onShowIconSelectionChange,
  page,
}) => {
  // Use current content-icon color (if set) as the default icon color
  const defaultIconColor = useMemo(
    () =>
      page.icon.type === UserIconType.ContentIcon ? page.icon.color : undefined,
    [page.icon],
  );
  // Use current emoji skin tone (if set) as the default icon color
  const defaultEmojiSkinTone = useMemo(
    () =>
      page.icon.type === UserIconType.Emoji ? page.icon.skinTone : undefined,
    [page.icon],
  );

  const [pickerPopoverOpen, _, setPickerPopoverOpen] =
    useToggle(showIconSelection);

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [showIconSelection]);

  const handleClear = useCreateCallback(clearPageIcon, page.path);

  const handleShowIconSelectionChange = useCallback(
    (value: boolean) => {
      onShowIconSelectionChange(value);
      setPickerPopoverOpen(value);
    },
    [onShowIconSelectionChange],
  );

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      setPageContentIcon(page.path, icon, color),
    [page.path],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) => setPageContentIconColor(page, color),
    [page],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      setPageEmoji(page.path, emoji, skinTone),
    [page.path],
  );

  return (
    <Popover
      open={pickerPopoverOpen}
      onOpenChange={handleShowIconSelectionChange}
    >
      <PopoverTrigger asChild>
        <NavItemIcon icon={page.icon} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          style={{ borderRadius: 8 }}
          side="top"
          sideOffset={4}
          collisionPadding={{ left: 14 }}
        >
          <IconPicker
            defaultPicker={page.icon.type}
            defaultIconColor={defaultIconColor}
            defaultEmojiSkinTone={defaultEmojiSkinTone}
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
