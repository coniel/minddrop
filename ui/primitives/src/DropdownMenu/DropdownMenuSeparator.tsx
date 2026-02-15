import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';
import { MenuSeparator } from '../Menu';

export type DropdownMenuSeparatorProps = DropdownMenuPrimitives.Separator.Props;

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Separator render={<MenuSeparator />} {...other} />
);
