import { ReactElement, useState } from 'react';
import { ContentIconName, Icons, UserIconType } from '@minddrop/ui-icons';
import { ContentColor } from '@minddrop/ui-theme';
import { Button } from '../Button';
import { ContentIconPicker } from '../ContentIconPicker';
import { Spacer } from '../Layout';
import { Text } from '../Text';
import './IconPicker.css';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverTrigger,
} from '../Popover';

export interface IconPickerProps {
  /**
   * The popover trigger element. Optional when using
   * controlled open state.
   */
  children?: ReactElement;

  /**
   * The current icon string. Used to set the default color.
   */
  currentIcon?: string;

  /**
   * Controlled open state. When provided, the picker
   * operates in controlled mode.
   */
  open?: boolean;

  /**
   * Callback fired when the open state changes.
   */
  onOpenChange?(open: boolean): void;

  /**
   * Whether to close the picker upon selection.
   */
  closeOnSelect?: boolean;

  /**
   * The default icon color. Typically set to the current
   * icon color if available.
   */
  defaultIconColor?: ContentColor;

  /**
   * Callback fired when an icon is selected.
   */
  onSelectIcon?(icon: ContentIconName, color: ContentColor, set: string): void;

  /**
   * Callback fired when an icon color is selected.
   */
  onSelectIconColor?(color: ContentColor): void;

  /**
   * Callback fired when an icon is selected.
   * @param iconString String representation of the selected icon.
   */
  onSelect?(iconString: string): void;

  /**
   * Callback fired when the clear button is clicked.
   */
  onClear?(): void;

  /**
   * The anchor element for popover positioning. Required
   * when no children trigger is provided.
   */
  anchor?: PopoverPositionerProps['anchor'];

  /**
   * The popover alignment.
   * @default 'start'
   */
  align?: PopoverPositionerProps['align'];

  /**
   * The popover side.
   * @default 'bottom'
   */
  side?: PopoverPositionerProps['side'];
}

export const IconPicker: React.FC<IconPickerProps> = ({
  children,
  closeOnSelect,
  defaultIconColor,
  onClear,
  onSelect,
  onSelectIcon,
  onSelectIconColor,
  currentIcon,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  anchor,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Support both controlled and uncontrolled open state
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;
  const [icon, setIcon] = useState<{
    name: ContentIconName;
    set: string;
  } | null>(null);

  const handleSelectIcon = (
    icon: ContentIconName,
    color: ContentColor,
    set: string,
    preventClose = false,
  ) => {
    setIcon({ name: icon, set });

    if (onSelectIcon) {
      onSelectIcon(icon, color, set);
    }

    if (onSelect) {
      // Stringifying qualifies the icon with its set when it is not
      // from the built-in set.
      onSelect(
        Icons.stringify({ type: UserIconType.ContentIcon, set, icon, color }),
      );
    }

    if (closeOnSelect && !preventClose) {
      setOpen(false);
    }
  };

  const handleSelectIconColor = (color: ContentColor) => {
    if (icon) {
      handleSelectIcon(icon.name, color, icon.set, true);
    }

    if (onSelectIconColor) {
      onSelectIconColor(color);
    }
  };

  const handleClear = () => {
    setIcon(null);

    if (onClear) {
      onClear();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {children && <PopoverTrigger>{children}</PopoverTrigger>}
      <PopoverPortal>
        <PopoverPositioner align="start" side="bottom" anchor={anchor}>
          <PopoverContent>
            <div className="icon-picker" onClick={stopPropagation}>
              <div className="icon-picker-header">
                <Text weight="medium" text="iconPicker.label" />
                <Spacer />
                <Button
                  variant="ghost"
                  label="actions.clear"
                  onClick={handleClear}
                />
              </div>
              <ContentIconPicker
                defaultColor={
                  (currentIcon && Icons.resolveColor(currentIcon)) ||
                  defaultIconColor
                }
                onSelect={handleSelectIcon}
                onSelectColor={handleSelectIconColor}
              />
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

// Prevent clicks inside the picker from bubbling through
// React's portal event system to parent components.
function stopPropagation(event: React.MouseEvent) {
  event.stopPropagation();
}
