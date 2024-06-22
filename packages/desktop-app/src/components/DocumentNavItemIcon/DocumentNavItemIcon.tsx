import { useCreateCallback, useToggle } from '@minddrop/utils';
import { DefaultDocumentIcon, Document } from '@minddrop/documents';
import { useCallback, useEffect } from 'react';
import { ContentIconName, EmojiSkinTone, useIcon } from '@minddrop/icons';
import { ContentColor } from '@minddrop/core';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from '@minddrop/ui';
import {
  clearDocumentIcon,
  setDocumentContentIcon,
  setDocumentContentIconColor,
  setDocumentEmoji,
} from '../../api';
import { NavItemIcon } from '../NavItemIcon';
import { IconPicker } from '../IconPicker';

export interface DocumentNavItemIconProps
  extends React.HTMLProps<HTMLDivElement> {
  /**
   * The associated document.
   */
  document: Document;

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

export const DocumentNavItemIcon: React.FC<DocumentNavItemIconProps> = ({
  showIconSelection = false,
  onShowIconSelectionChange,
  document,
}) => {
  const { icon, color, skinTone } = useIcon(document.icon, DefaultDocumentIcon);

  const [pickerPopoverOpen, _, setPickerPopoverOpen] =
    useToggle(showIconSelection);

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [showIconSelection]);

  const handleClear = useCreateCallback(clearDocumentIcon, document.path);

  const handleShowIconSelectionChange = useCallback(
    (value: boolean) => {
      onShowIconSelectionChange(value);
      setPickerPopoverOpen(value);
    },
    [onShowIconSelectionChange],
  );

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      setDocumentContentIcon(document.path, icon, color),
    [document.path],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) => setDocumentContentIconColor(document, color),
    [document],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      setDocumentEmoji(document.path, emoji, skinTone),
    [document.path],
  );

  return (
    <Popover
      open={pickerPopoverOpen}
      onOpenChange={handleShowIconSelectionChange}
    >
      <PopoverTrigger asChild>
        <NavItemIcon defaultIcon={DefaultDocumentIcon} icon={document.icon} />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          style={{ borderRadius: 8 }}
          side="top"
          sideOffset={4}
          collisionPadding={{ left: 14 }}
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
