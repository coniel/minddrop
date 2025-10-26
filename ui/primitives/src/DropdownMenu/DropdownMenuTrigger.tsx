import { Menu as DropdownMenuPrimitives } from '@base-ui-components/react/menu';
import { FC } from 'react';

export type DropdownMenuTriggerProps = DropdownMenuPrimitives.Trigger.Props;

export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  children,
  ...other
}) => (
  <DropdownMenuPrimitives.Trigger {...other}>
    {children}
  </DropdownMenuPrimitives.Trigger>
);
