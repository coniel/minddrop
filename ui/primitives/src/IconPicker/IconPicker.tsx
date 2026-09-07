import { ReactElement, useMemo, useState } from 'react';
import {
  ContentIconBackground,
  ContentIconName,
  Icons,
  UserIcon,
} from '@minddrop/ui-icons';
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
   * The current icon string. Sets the default color and background,
   * and receives color and background changes made before an icon
   * is picked.
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
  onSelectIcon?(
    icon: ContentIconName,
    color: ContentColor,
    set: string,
    background?: ContentIconBackground,
  ): void;

  /**
   * Callback fired when an icon color is selected.
   */
  onSelectIconColor?(color: ContentColor): void;

  /**
   * Callback fired when an icon background is selected.
   */
  onSelectIconBackground?(background: ContentIconBackground): void;

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
  onSelectIconBackground,
  currentIcon,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  anchor,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Support both controlled and uncontrolled open state
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen;
  const [icon, setIcon] = useState<UserIcon | null>(null);

  // Until an icon is picked, color and background changes apply to
  // the current icon.
  const currentParsedIcon = useMemo(
    () => Icons.parse(currentIcon),
    [currentIcon],
  );
  const target = icon ?? currentParsedIcon;

  const handleSelectIcon = (selectedIcon: UserIcon, preventClose = false) => {
    setIcon(selectedIcon);

    if (onSelectIcon) {
      onSelectIcon(
        selectedIcon.icon,
        selectedIcon.color,
        selectedIcon.set,
        selectedIcon.background,
      );
    }

    if (onSelect) {
      onSelect(Icons.stringify(selectedIcon));
    }

    if (closeOnSelect && !preventClose) {
      setOpen(false);
    }
  };

  const handleSelectIconColor = (color: ContentColor) => {
    if (target) {
      handleSelectIcon(Icons.applyColor(target, color), true);
    }

    if (onSelectIconColor) {
      onSelectIconColor(color);
    }
  };

  const handleSelectIconBackground = (background: ContentIconBackground) => {
    if (target) {
      handleSelectIcon(Icons.applyBackground(target, background), true);
    }

    if (onSelectIconBackground) {
      onSelectIconBackground(background);
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
                currentIcon={target ? Icons.stringify(target) : undefined}
                defaultColor={
                  (currentIcon && Icons.resolveColor(currentIcon)) ||
                  defaultIconColor
                }
                defaultBackground={currentParsedIcon?.background}
                onSelect={handleSelectIcon}
                onSelectColor={handleSelectIconColor}
                onSelectBackground={handleSelectIconBackground}
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
