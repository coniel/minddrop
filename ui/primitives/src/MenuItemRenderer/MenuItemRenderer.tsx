import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { MenuItem, MenuItemProps } from '../Menu/MenuItem';
import { MenuRadioItem } from '../Menu/MenuRadioItem';
import { SwitchMenuItem, SwitchMenuItemProps } from '../Menu/SwitchMenuItem';
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
   Wraps Menu.RadioItem with a styled MenuRadioItem.
   Uses a primary-colored dot inside a circle as the indicator.
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
        <MenuRadioItem
          value={value}
          disabled={disabled}
          indicator={
            <MenuPrimitive.RadioItemIndicator
              render={<span className="menu-item-radio-dot" />}
            />
          }
          {...itemProps}
        >
          {itemIndicator}
        </MenuRadioItem>
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

/* ============================================================
   SWITCH MENU ITEM RENDERER
   Wraps Menu.CheckboxItem with a styled SwitchMenuItem.
   Base UI handles keyboard, toggle state, aria, and
   closeOnClick={false} by default.
   ============================================================ */

export interface SwitchMenuItemRendererProps
  extends Omit<SwitchMenuItemProps, 'onClick'> {
  /*
   * Prevents interaction.
   */
  disabled?: boolean;
}

export const SwitchMenuItemRenderer: FC<SwitchMenuItemRendererProps> = ({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  ...other
}) => (
  <MenuPrimitive.CheckboxItem
    checked={checked}
    defaultChecked={defaultChecked}
    onCheckedChange={onCheckedChange}
    disabled={disabled}
    render={<SwitchMenuItem checked={checked} disabled={disabled} {...other} />}
  />
);
