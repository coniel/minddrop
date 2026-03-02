import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC, useMemo } from 'react';
import { useTranslation } from '@minddrop/i18n';
import { MenuRadioItem } from '../Menu/MenuRadioItem';
import { Tooltip } from '../Tooltip';
import { ActionMenuItemProps, useShiftState } from './ActionMenuItem';

/* ============================================================
   TYPES
   ============================================================ */

export interface ActionMenuRadioItemProps extends ActionMenuItemProps {
  /**
   * The value this radio item represents within a RadioGroup.
   */
  value: string;

  /**
   * Indicator element rendered when the item is selected.
   * Typically a RadioItemIndicator with a check icon.
   */
  itemIndicator?: React.ReactNode;
}

/* ============================================================
   ACTION MENU RADIO ITEM
   Wraps Menu.RadioItem with a styled MenuRadioItem.
   Uses a primary-colored dot inside a circle as the indicator.
   ============================================================ */

/** Renders a Base UI Menu.RadioItem with styled MenuRadioItem and optional shift-key secondary state. */
export const ActionMenuRadioItem: FC<ActionMenuRadioItemProps> = ({
  label,
  secondaryLabel,
  icon,
  secondaryIcon,
  onClick,
  secondaryOnClick,
  keyboardShortcut,
  secondaryKeyboardShortcut,
  tooltip,
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

  if (tooltip) {
    return (
      <Tooltip side="right" sideOffset={6} {...tooltip}>
        {item}
      </Tooltip>
    );
  }

  return item;
};
