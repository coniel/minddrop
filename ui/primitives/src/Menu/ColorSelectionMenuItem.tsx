import { Menu } from '@base-ui/react/menu';
import React from 'react';
import { ContentColor } from '@minddrop/ui-theme';
import { ContentColors } from '../constants';
import { propsToClass } from '../utils';
import { MenuItem } from './MenuItem';

export interface ColorSelectionMenuItemProps extends Menu.Item.Props {
  /*
   * The color this item represents.
   */
  color: ContentColor | 'default';

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
>(({ className, color, label: _label, ...other }, ref) => {
  // Find the label key for this color
  const labelKey = ContentColors.find((c) => c.value === color)?.labelKey;

  return (
    <MenuItem
      ref={ref}
      className={propsToClass('color-selection-menu-item', { className })}
      {...other}
      label={labelKey}
      icon={<div className={`color-swatch color-swatch-${color}`} />}
    />
  );
});

ColorSelectionMenuItem.displayName = 'ColorSelectionMenuItem';
