import { FC } from 'react';
import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';

export type ContextMenuPortalProps =
  ContextMenuPrimitives.ContextMenuPortalProps;

export const ContextMenuPortal: FC<ContextMenuPortalProps> = ({
  children,
  ...other
}) => (
  <ContextMenuPrimitives.Portal {...other}>
    {children}
  </ContextMenuPrimitives.Portal>
);
