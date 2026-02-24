import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { Icon } from '../Icon';
import { MenuItem, MenuItemProps } from '../Menu/MenuItem';
import { Tooltip } from '../Tooltip';

/* ============================================================
   SHARED TYPES
   ============================================================ */

export interface MenuItemRendererProps extends Omit<MenuItemProps, 'onClick'> {
  /*
   * The label in its secondary (shift) state.
   */
  secondaryLabel?: MenuItemProps['label'];

  /*
   * Icon in its secondary (shift) state.
   */
  secondaryIcon?: MenuItemProps['icon'];

  /*
   * Handler called when the item is selected in its secondary state.
   * Registering this prop enables shift-key detection.
   */
  secondaryOnClick?: MenuPrimitive.Item.Props['onClick'];

  /*
   * Click handler for the primary state.
   */
  onClick?: MenuPrimitive.Item.Props['onClick'];

  /*
   * Keyboard shortcut displayed on the primary item.
   */
  keyboardShortcut?: string[];

  /*
   * Keyboard shortcut displayed in the secondary state.
   */
  secondaryKeyboardShortcut?: string[];

  /*
   * Tooltip title shown on hover.
   */
  tooltipTitle?: React.ReactNode;

  /*
   * Tooltip description shown on hover.
   */
  tooltipDescription?: React.ReactNode;

  /*
   * Text used for typeahead when content is non-textual.
   */
  textValue?: string;

  /*
   * Prevents interaction.
   */
  disabled?: boolean;
}

export interface RadioMenuItemRendererProps extends MenuItemRendererProps {
  /*
   * The value this radio item represents within a RadioGroup.
   */
  value: string;

  /*
   * Indicator element rendered when the item is selected.
   * Typically a RadioItemIndicator with a check icon.
   */
  itemIndicator?: React.ReactNode;
}

/* ============================================================
   SHARED HOOK
   Handles shift-key secondary state detection.
   ============================================================ */

function useShiftState(enabled: boolean) {
  const [shiftKeyDown, setShiftKeyDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftKeyDown(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setShiftKeyDown(false);
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
   MENU ITEM RENDERER
   Wraps Menu.Item with a styled MenuItem and optional
   shift-key secondary state and tooltip.
   ============================================================ */

export const MenuItemRenderer: FC<MenuItemRendererProps> = ({
  label,
  secondaryLabel,
  icon,
  secondaryIcon,
  onClick,
  secondaryOnClick,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltipTitle,
  tooltipDescription,
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
      }
    : { label: primaryLabel, icon, keyboardShortcut };

  const item = (
    <MenuPrimitive.Item
      disabled={disabled}
      onClick={shiftKeyDown && secondaryOnClick ? secondaryOnClick : onClick}
      render={<MenuItem disabled={disabled} {...itemProps} />}
      {...other}
    />
  );

  if (tooltipTitle || tooltipDescription) {
    return (
      <Tooltip
        side="right"
        sideOffset={6}
        title={tooltipTitle}
        description={tooltipDescription}
      >
        {item}
      </Tooltip>
    );
  }

  return item;
};

/* ============================================================
   RADIO MENU ITEM RENDERER
   Wraps Menu.RadioItem with a styled MenuItem.
   Accepts an itemIndicator for the selected state checkmark.
   ============================================================ */

export const RadioMenuItemRenderer: FC<RadioMenuItemRendererProps> = ({
  label,
  secondaryLabel,
  icon,
  secondaryIcon,
  onClick,
  secondaryOnClick,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltipTitle,
  tooltipDescription,
  disabled,
  textValue,
  value,
  itemIndicator,
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
      }
    : { label: primaryLabel, icon, keyboardShortcut };

  const item = (
    <MenuPrimitive.RadioItem
      value={value}
      disabled={disabled}
      onClick={shiftKeyDown && secondaryOnClick ? secondaryOnClick : onClick}
      render={
        <MenuItem
          disabled={disabled}
          {...itemProps}
          icon={
            <MenuPrimitive.RadioItemIndicator>
              <Icon name="check" className="item-indicator" />
            </MenuPrimitive.RadioItemIndicator>
          }
        >
          {itemIndicator}
        </MenuItem>
      }
      {...other}
    />
  );

  if (tooltipTitle || tooltipDescription) {
    return (
      <Tooltip
        side="right"
        sideOffset={6}
        title={tooltipTitle}
        description={tooltipDescription}
      >
        {item}
      </Tooltip>
    );
  }

  return item;
};
