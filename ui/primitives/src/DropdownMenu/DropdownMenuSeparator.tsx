import { Menu as DropdownMenuPrimitives } from '@base-ui-components/react/menu';
import { FC } from 'react';
import { MenuSeparator } from '../Menu';

export type DropdownMenuSeparatorProps = DropdownMenuPrimitives.Separator.Props;

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Separator {...other}>
    <MenuSeparator />
  </DropdownMenuPrimitives.Separator>
);
