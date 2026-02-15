import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';
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
  <DropdownMenuPrimitives.Item disabled={disabled} {...other}>
    <ColorSelectionMenuItem disabled={disabled} color={color} />
  </DropdownMenuPrimitives.Item>
);
