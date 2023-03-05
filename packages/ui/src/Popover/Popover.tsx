import * as PopoverPrimitive from '@radix-ui/react-popover';
import { FC } from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Popover.css';

export type PopoverProps = PopoverPrimitive.PopoverProps;
export type PopoverTriggerProps = PopoverPrimitive.PopoverTriggerProps;
export type PopoverAnchorProps = PopoverPrimitive.PopoverAnchorProps;
export type PopoverCloseProps = PopoverPrimitive.PopoverCloseProps;
export type PopoverContentProps = PopoverPrimitive.PopoverContentProps;

export const Popover = PopoverPrimitive.Root;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

export const PopoverTrigger: FC<PopoverTriggerProps> = ({
  children,
  ...other
}) => (
  <PopoverPrimitive.Trigger asChild {...other}>
    {children}
  </PopoverPrimitive.Trigger>
);

export const PopoverContent: FC<PopoverContentProps> = ({
  children,
  className,
  asChild,
  ...other
}) => (
  <PopoverPrimitive.Content asChild {...other}>
    <div className={mapPropsToClasses({ className }, 'popover')}>
      {children}
    </div>
  </PopoverPrimitive.Content>
);
