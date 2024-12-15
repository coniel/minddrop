import * as ContextMenuPrimitives from '@radix-ui/react-context-menu';
import { FC } from 'react';

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
