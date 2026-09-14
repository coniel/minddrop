import React from 'react';
import { TranslationKey, i18n } from '@minddrop/i18n';
import { ContentColor } from '@minddrop/ui-theme';
import { Chip } from '../../Chip';
import { MenuItem, MenuItemProps } from '../MenuItem';

export interface ChipMenuItemProps
  extends Omit<MenuItemProps, 'label' | 'children'> {
  /**
   * Label text. Strings are treated as i18n keys and translated.
   */
  label?: TranslationKey;

  /**
   * The colour of the label chip. Defaults to the neutral chip
   * colour.
   */
  color?: ContentColor;
}

/**
 * Renders a menu item whose label is a chip in the given colour.
 */
export const ChipMenuItem = React.forwardRef<HTMLDivElement, ChipMenuItemProps>(
  ({ label, stringLabel, color = 'default', ...other }, ref) => (
    <MenuItem
      ref={ref}
      label={
        <Chip size="sm" color={color}>
          {stringLabel ?? (label && i18n.t(label))}
        </Chip>
      }
      {...other}
    />
  ),
);

ChipMenuItem.displayName = 'ChipMenuItem';
