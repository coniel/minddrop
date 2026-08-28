import { Menu } from '@base-ui/react/menu';
import React from 'react';
import { ContentColor } from '@minddrop/ui-theme';
import { Icon } from '../Icon';
import { ContentColorValues } from '../constants';
import { propsToClass } from '../utils';
import { MenuItem } from './MenuItem';

export interface ColorSelectionMenuItemProps extends Menu.Item.Props {
  /*
   * The color this item represents.
   */
  color: ContentColor | 'default';

  /*
   * Renders a check on the right when this item's color is the
   * selected one.
   */
  checked?: boolean;

  /*
   * Prevents interaction with the item.
   */
  disabled?: boolean;

  /*
   * Class name applied to the root element.
   */
  className?: string;
}

export const ColorSelectionMenuItem = React.forwardRef<
  HTMLDivElement,
  ColorSelectionMenuItemProps
>(({ className, color, checked, label: _label, ...other }, ref) => {
  // Find the label key for this color
  const labelKey = ContentColorValues.find((c) => c.value === color)?.labelKey;

  return (
    <MenuItem
      ref={ref}
      className={propsToClass('color-selection-menu-item', { className })}
      aria-checked={checked === undefined ? undefined : checked}
      {...other}
      label={labelKey}
      icon={<div className={`color-swatch color-swatch-${color}`} />}
      trailingIcon={checked ? <Icon name="check" /> : undefined}
    />
  );
});

ColorSelectionMenuItem.displayName = 'ColorSelectionMenuItem';
