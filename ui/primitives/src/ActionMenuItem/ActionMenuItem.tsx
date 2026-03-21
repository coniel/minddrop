import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC, useEffect, useState } from 'react';
import { MenuItem, MenuItemProps } from '../Menu/MenuItem';
import { Tooltip, TooltipProps } from '../Tooltip';

/* ============================================================
   SHARED HOOK
   Handles shift-key secondary state detection.
   ============================================================ */

export function useShiftState(enabled: boolean) {
  const [shiftKeyDown, setShiftKeyDown] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftKeyDown(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        setShiftKeyDown(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  return shiftKeyDown;
}

/* ============================================================
   TYPES
   ============================================================ */

export interface ActionMenuItemProps extends Omit<MenuItemProps, 'onClick'> {
  /**
   * Base UI primitive component used as the outer item.
   * Defaults to Menu.Item. Pass Combobox.Item for combobox usage.
   * @default MenuPrimitive.Item
   */
  component?: React.ElementType;
  /**
   * The label in its secondary (shift) state.
   */
  secondaryLabel?: MenuItemProps['label'];

  /**
   * Icon in its secondary (shift) state.
   */
  secondaryIcon?: MenuItemProps['icon'];

  /**
   * Handler called when the item is selected in its secondary state.
   * Registering this prop enables shift-key detection.
   */
  secondaryOnSelect?: () => void;

  /**
   * Handler called when the item is selected
   * (via click or keyboard).
   */
  onSelect?: () => void;

  /**
   * Keyboard shortcut displayed on the primary item.
   */
  keyboardShortcut?: string[];

  /**
   * Keyboard shortcut displayed in the secondary state.
   */
  secondaryKeyboardShortcut?: string[];

  /**
   * Tooltip configuration. When provided, wraps the item
   * in a Tooltip with the given props.
   */
  tooltip?: Omit<TooltipProps, 'children'>;

  /**
   * Text used for typeahead when content is non-textual.
   */
  textValue?: string;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;
}

/* ============================================================
   ACTION MENU ITEM
   Wraps Menu.Item with a styled MenuItem and optional
   shift-key secondary state and tooltip.
   ============================================================ */

/** Renders a Base UI Menu.Item with styled MenuItem and optional shift-key secondary state. */
export const ActionMenuItem: FC<ActionMenuItemProps> = ({
  component: Component = MenuPrimitive.Item,
  label,
  stringLabel,
  secondaryLabel,
  icon,
  secondaryIcon,
  contentIcon,
  onSelect,
  secondaryOnSelect,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltip,
  disabled,
  textValue,
  ...other
}) => {
  const shiftKeyDown = useShiftState(!!secondaryOnSelect);

  // Resolve the click handler based on shift state
  const handleClick =
    shiftKeyDown && secondaryOnSelect ? secondaryOnSelect : onSelect;

  // Pass labels through to MenuItem which handles translation
  const itemProps = shiftKeyDown
    ? {
        label: secondaryLabel ?? label,
        icon: secondaryIcon ?? icon,
        keyboardShortcut: secondaryKeyboardShortcut,
        contentIcon,
        stringLabel: secondaryLabel ? undefined : stringLabel,
      }
    : { label, stringLabel, icon, keyboardShortcut, contentIcon };

  const item = (
    <Component
      disabled={disabled}
      onClick={handleClick}
      render={<MenuItem disabled={disabled} {...itemProps} />}
      {...other}
    />
  );

  if (tooltip) {
    return (
      <Tooltip side="right" sideOffset={6} {...tooltip}>
        {item}
      </Tooltip>
    );
  }

  return item;
};
