import React, { useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { ContentIcon } from '../ContentIcon';
import { IconButton } from '../IconButton';
import { IconPicker } from '../IconPicker';
import { Group } from '../Layout';
import { TextInput } from '../fields/TextInput';
import { propsToClass } from '../utils';

export interface MenuRenameItemProps {
  /**
   * The current name value.
   */
  value: string;

  /**
   * Callback fired when the name changes via the input.
   */
  onValueChange: (value: string) => void;

  /**
   * Callback fired when the user presses Enter or the
   * input loses focus, signaling a rename should be committed.
   */
  onRename: (value: string) => void;

  /**
   * Stringified content icon. When provided, an icon picker
   * button is rendered to the left of the input.
   */
  contentIcon?: string;

  /**
   * Callback fired when an icon is selected from the picker.
   * Receives the stringified icon value.
   */
  onSelectIcon?: (iconString: string) => void;

  /**
   * Callback fired when the icon is cleared via the picker.
   */
  onClearIcon?: () => void;

  /**
   * Placeholder text for the input. Can be an i18n key.
   */
  placeholder?: TranslationKey;

  /**
   * Class name applied to the root element.
   */
  className?: string;
}

/**
 * Renders a rename input at the top of a menu, outside
 * keyboard navigation flow. Optionally includes an icon
 * picker button when a content icon is provided.
 */
export const MenuRenameItem: React.FC<MenuRenameItemProps> = ({
  value,
  onValueChange,
  onRename,
  contentIcon,
  onSelectIcon,
  onClearIcon,
  placeholder,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);

  // Keep local state in sync with controlled value
  const handleValueChange = (newValue: string) => {
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  // Commit the rename on blur
  const handleBlur = () => {
    if (localValue !== value) {
      onRename(localValue);
    }
  };

  // Commit the rename on Enter
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onRename(localValue);
    }
  };

  return (
    <Group
      role="none"
      className={propsToClass('menu-rename-item', { className })}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {contentIcon && (
        <IconPicker
          currentIcon={contentIcon}
          onSelect={onSelectIcon}
          onClear={onClearIcon}
          closeOnSelect
        >
          <IconButton
            className="menu-rename-item-icon-button"
            variant="outline"
            size="md"
            label="iconPicker.change"
          >
            <ContentIcon icon={contentIcon} color="inherit" />
          </IconButton>
        </IconPicker>
      )}
      <TextInput
        ref={inputRef}
        variant="outline"
        size="md"
        value={localValue}
        placeholder={placeholder}
        onValueChange={handleValueChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </Group>
  );
};

MenuRenameItem.displayName = 'MenuRenameItem';
