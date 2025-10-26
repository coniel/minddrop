import { Menu as DropdownMenuPrimitives } from '@base-ui-components/react/menu';
import { FC } from 'react';
import { MenuLabel } from '../Menu';

export type DropdownMenuLabelProps = DropdownMenuPrimitives.GroupLabel.Props;

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.GroupLabel {...other}>
    <MenuLabel>{children}</MenuLabel>
  </DropdownMenuPrimitives.GroupLabel>
);
