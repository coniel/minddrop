import { Menu } from '@base-ui/react/menu';
import React from 'react';
import { i18n } from '@minddrop/i18n';
import { ContentColors } from '../constants';
import { ContentColor } from '@minddrop/theme';
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
>(({ className, color, ...other }, ref) => {
  const colorConfig = ContentColors.find((c) => c.value === color);

  return (
    <MenuItem
      ref={ref}
      className={propsToClass('color-selection-menu-item', { className })}
      label={i18n.t(colorConfig ? colorConfig.labelKey : '') as string}
      icon={<div className={`color-swatch color-swatch-${color}`} />}
      {...other}
    />
  );
});

ColorSelectionMenuItem.displayName = 'ColorSelectionMenuItem';
