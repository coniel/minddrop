import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';

export type DropdownMenuPortalProps = DropdownMenuPrimitives.Portal.Props;

export const DropdownMenuPortal: FC<DropdownMenuPortalProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Portal {...other}>
    {children}
  </DropdownMenuPrimitives.Portal>
);
