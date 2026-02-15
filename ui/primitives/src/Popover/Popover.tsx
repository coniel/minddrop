import { Popover as PopoverPrimitives } from '@base-ui/react/popover';
import React from 'react';
import { mapPropsToClasses } from '@minddrop/utils';
import './Popover.css';

export type PopoverProps = PopoverPrimitives.Root.Props;
export type PopoverTriggerProps = PopoverPrimitives.Trigger.Props & {
  children: PopoverPrimitives.Trigger.Props['render'];
};
export type PopoverPositionerProps = PopoverPrimitives.Positioner.Props;
export type PopoverCloseProps = PopoverPrimitives.Close.Props;
export type PopoverContentProps = PopoverPrimitives.Popup.Props;

export const Popover = PopoverPrimitives.Root;
export const PopoverPositioner = PopoverPrimitives.Positioner;
export const PopoverClose = PopoverPrimitives.Close;
export const PopoverPortal = PopoverPrimitives.Portal;

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(({ children, ...other }, ref) => (
  <PopoverPrimitives.Trigger ref={ref} render={children} {...other} />
));

PopoverTrigger.displayName = 'PopoverTrigger';

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps & { minWidth?: number; className?: string }
>(({ children, className, minWidth, ...other }, ref) => (
  <PopoverPrimitives.Popup
    ref={ref}
    render={
      <div
        className={mapPropsToClasses({ className }, 'popover')}
        style={{ minWidth }}
      >
        {children}
      </div>
    }
    {...other}
  />
));

PopoverContent.displayName = 'PopoverContent';
