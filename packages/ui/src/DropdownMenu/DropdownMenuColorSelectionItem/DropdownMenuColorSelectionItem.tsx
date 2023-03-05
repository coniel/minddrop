import React, { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';
import { InteractiveMenuItemProps } from '../../InteractiveMenuItem';
import {
  ColorSelectionMenuItem,
  ColorSelectionMenuItemProps,
} from '../../Menu';

export interface DropdownMenuColorSelectionItemProps
  extends Omit<ColorSelectionMenuItemProps, 'onSelect'> {
  onSelect?: InteractiveMenuItemProps['onSelect'];
  disabled?: InteractiveMenuItemProps['disabled'];
}

export const DropdownMenuColorSelectionItem: FC<
  DropdownMenuColorSelectionItemProps
> = ({ disabled, color, ...other }) => (
  <DropdownMenuPrimitives.Item asChild disabled={disabled} {...other}>
    <ColorSelectionMenuItem disabled={disabled} color={color} />
  </DropdownMenuPrimitives.Item>
);
