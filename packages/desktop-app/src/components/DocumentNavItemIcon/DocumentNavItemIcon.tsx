import { useCallback, useEffect } from 'react';
import { ContentColor } from '@minddrop/core';
import { DefaultDocumentIcon, Document } from '@minddrop/documents';
import { ContentIconName, EmojiSkinTone, useIcon } from '@minddrop/icons';
import { NavItemIcon } from '@minddrop/ui-desktop';
import {
  IconPicker,
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverPortal,
} from '@minddrop/ui-elements';
import { useCreateCallback, useToggle } from '@minddrop/utils';
import {
  clearDocumentIcon,
  setDocumentContentIcon,
  setDocumentContentIconColor,
  setDocumentEmoji,
} from '../../api';

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

  const [pickerPopoverOpen, togglePickerPopoverOpen, setPickerPopoverOpen] =
    useToggle(showIconSelection);

  useEffect(() => {
    setPickerPopoverOpen(showIconSelection);
  }, [showIconSelection, setPickerPopoverOpen]);

  const handleClear = useCreateCallback(clearDocumentIcon, document.id);

  const handleCloseIconSelection = useCallback(() => {
    onShowIconSelectionChange(false);
    setPickerPopoverOpen(false);
  }, [onShowIconSelectionChange, setPickerPopoverOpen]);

  const handleSelectContentIcon = useCallback(
    (icon: ContentIconName, color: ContentColor) =>
      setDocumentContentIcon(document.id, icon, color),
    [document.id],
  );

  const handleSelectIconColor = useCallback(
    (color: ContentColor) => setDocumentContentIconColor(document, color),
    [document],
  );

  const handleSelectEmoji = useCallback(
    (emoji: string, skinTone: EmojiSkinTone) =>
      setDocumentEmoji(document.id, emoji, skinTone),
    [document.id],
  );

  return (
    <Popover open={pickerPopoverOpen}>
      <PopoverAnchor onClick={togglePickerPopoverOpen} asChild>
        <NavItemIcon defaultIcon={DefaultDocumentIcon} icon={document.icon} />
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
