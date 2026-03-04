import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
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
  secondaryOnClick?: MenuPrimitive.Item.Props['onClick'];

  /**
   * Click handler for the primary state.
   */
  onClick?: MenuPrimitive.Item.Props['onClick'];

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
  label,
  secondaryLabel,
  icon,
  secondaryIcon,
  contentIcon,
  onClick,
  secondaryOnClick,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltip,
  disabled,
  textValue,
  ...other
}) => {
  const { t } = useTranslation();

  const shiftKeyDown = useShiftState(!!secondaryOnClick);

  const primaryLabel = useMemo(
    () => (typeof label === 'string' ? t(label) : label),
    [label, t],
  );
  const altLabel = useMemo(
    () =>
      typeof secondaryLabel === 'string' ? t(secondaryLabel) : secondaryLabel,
    [secondaryLabel, t],
  );

  const itemProps = shiftKeyDown
    ? {
        label: altLabel ?? primaryLabel,
        icon: secondaryIcon ?? icon,
        keyboardShortcut: secondaryKeyboardShortcut,
        contentIcon,
      }
    : { label: primaryLabel, icon, keyboardShortcut, contentIcon };

  const item = (
    <MenuPrimitive.Item
      disabled={disabled}
      onClick={shiftKeyDown && secondaryOnClick ? secondaryOnClick : onClick}
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
