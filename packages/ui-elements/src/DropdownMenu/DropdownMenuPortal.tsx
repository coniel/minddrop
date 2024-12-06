import { FC } from 'react';
import * as DropdownMenuPrimitives from '@radix-ui/react-dropdown-menu';

export type DropdownMenuPortalProps =
  DropdownMenuPrimitives.DropdownMenuPortalProps;

export const DropdownMenuPortal: FC<DropdownMenuPortalProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Portal {...other}>
    {children}
  </DropdownMenuPrimitives.Portal>
);
