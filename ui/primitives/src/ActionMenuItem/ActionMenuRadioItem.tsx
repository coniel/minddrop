import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import React, { FC } from 'react';
import { MenuItemProps } from '../Menu/MenuItem';
import { MenuRadioItem } from '../Menu/MenuRadioItem';
import { Tooltip, TooltipProps } from '../Tooltip';

/* ============================================================
   TYPES
   ============================================================ */

export interface ActionMenuRadioItemProps
  extends Omit<MenuItemProps, 'active' | 'trailingIcon' | 'onClick'> {
  /**
   * The value this radio item represents within a RadioGroup.
   */
  value: string;

  /**
   * Indicator element rendered when the item is selected.
   * Typically a RadioItemIndicator with a check icon.
   */
  itemIndicator?: React.ReactNode;

  /**
   * Click handler.
   */
  onClick?: MenuPrimitive.RadioItem.Props['onClick'];

  /**
   * Tooltip configuration. When provided, wraps the item
   * in a Tooltip with the given props.
   */
  tooltip?: Omit<TooltipProps, 'children'>;

  /**
   * Prevents interaction.
   */
  disabled?: boolean;

  /**
   * Text used for typeahead when content is non-textual.
   */
  textValue?: string;
}

/* ============================================================
   ACTION MENU RADIO ITEM
   Wraps Menu.RadioItem with a styled MenuRadioItem.
   Uses a primary-colored dot inside a circle as the indicator.
   ============================================================ */

/** Renders a Base UI Menu.RadioItem with styled MenuRadioItem. */
export const ActionMenuRadioItem: FC<ActionMenuRadioItemProps> = ({
  label,
  stringLabel,
  icon,
  onClick,
  keyboardShortcut,
  tooltip,
  disabled,
  textValue,
  value,
  itemIndicator,
  ...other
}) => {
  const item = (
    <MenuPrimitive.RadioItem
      value={value}
      disabled={disabled}
      onClick={onClick}
      render={
        <MenuRadioItem
          value={value}
          disabled={disabled}
          label={label}
          stringLabel={stringLabel}
          icon={icon}
          keyboardShortcut={keyboardShortcut}
          indicator={
            <MenuPrimitive.RadioItemIndicator
              render={<span className="menu-item-radio-dot" />}
            />
          }
          {...other}
        >
          {itemIndicator}
        </MenuRadioItem>
      }
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
