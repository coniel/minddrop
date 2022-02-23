import React, { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { TooltipMenuItemProps } from '../../types';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../../Menu';

export interface DropdownMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onSelect?: TooltipMenuItemProps['onSelect'];
  disabled?: TooltipMenuItemProps['disabled'];
}

export const DropdownMenuColorSelectionItem: FC<DropdownMenuColorSelectionItemProps> =
  ({ disabled, color, ...other }) => {
    return (
      <DropdownMenuPrimitives.Item asChild disabled={disabled} {...other}>
        <ColorSelectionMenuItem disabled={disabled} color={color} />
      </DropdownMenuPrimitives.Item>
    );
  };
