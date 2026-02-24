import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import React from 'react';
import { propsToClass } from '../utils';
import './Popover.css';

export type PopoverProps = PopoverPrimitive.Root.Props;
export type PopoverTriggerProps = PopoverPrimitive.Trigger.Props;
export type PopoverPositionerProps = PopoverPrimitive.Positioner.Props;
export type PopoverCloseProps = PopoverPrimitive.Close.Props;
export type PopoverPortalProps = PopoverPrimitive.Portal.Props;

export interface PopoverContentProps extends PopoverPrimitive.Popup.Props {
  /*
   * Minimum width of the popover.
   */
  minWidth?: number | string;

  /*
   * Class name applied to the popup element.
   */
  className?: string;
}

/*
 * Root — manages open/close state.
 */
export const Popover = PopoverPrimitive.Root;

/*
 * Trigger — the element that opens the popover.
 * Accepts any renderable element via the render prop.
 */
export const PopoverTrigger = PopoverPrimitive.Trigger;

/*
 * Positioner — positions the popup relative to the trigger.
 */
export const PopoverPositioner = React.forwardRef<
  HTMLDivElement,
  PopoverPositionerProps
>((props, ref) => (
  <PopoverPrimitive.Positioner
    ref={ref}
    className="popover-positioner"
    {...props}
  />
));

PopoverPositioner.displayName = 'PopoverPositioner';

/*
 * Content — the popup panel itself.
 */
export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ children, className, minWidth, style, ...other }, ref) => (
  <PopoverPrimitive.Popup
    ref={ref}
    className={propsToClass('popover', { className })}
    style={{ minWidth, ...style }}
    {...other}
  >
    {children}
  </PopoverPrimitive.Popup>
));

PopoverContent.displayName = 'PopoverContent';

/*
 * Close — a button that closes the popover.
 */
export const PopoverClose = PopoverPrimitive.Close;

/*
 * Portal — renders the popover outside the DOM hierarchy.
 */
export const PopoverPortal = PopoverPrimitive.Portal;
