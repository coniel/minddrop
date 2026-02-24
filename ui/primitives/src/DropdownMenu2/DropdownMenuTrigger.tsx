import { Menu as DropdownMenuPrimitives } from '@base-ui/react/menu';
import { FC } from 'react';

export type DropdownMenuTriggerProps = DropdownMenuPrimitives.Trigger.Props & {
  children: DropdownMenuPrimitives.Trigger.Props['render'];
};

export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  children,
  ...other
}) => <DropdownMenuPrimitives.Trigger {...other} render={children} />;
