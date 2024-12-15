import React from 'react';
import { i18n } from '@minddrop/i18n';
import { mapPropsToClasses } from '@minddrop/utils';
import { ContentColors } from '../../constants';
import { ContentColor } from '../../types';
import { MenuItem } from '../MenuItem';
import './ColorSelectionMenuItem.css';

export interface ColorSelectionMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The color option which the menu item represents.
   * Must be a `ContentColor`.
   */
  color: ContentColor | 'default';

  /**
   * When `true`, prevents the user from interacting with the item.
   */
  disabled?: boolean;
}

export const ColorSelectionMenuItem = React.forwardRef<
  HTMLDivElement,
  ColorSelectionMenuItemProps
>(({ className, color, ...other }, ref) => {
  const colorConfig = ContentColors.find((config) => config.value === color);

  return (
    <MenuItem
      ref={ref}
      className={mapPropsToClasses({ className }, 'color-selection-menu-item')}
      label={i18n.t(colorConfig ? colorConfig.labelKey : '') as string}
      icon={
        <div
          data-testid="icon"
          className={mapPropsToClasses({ color }, 'icon')}
        />
      }
      {...other}
    />
  );
});

ColorSelectionMenuItem.displayName = 'ColorSelectionMenuItem';
