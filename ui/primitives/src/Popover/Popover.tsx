import { Popover as PopoverPrimitive } from '@base-ui/react/popover';
import React from 'react';
import { useMenuTargetContext } from '../MenuTargetContext';
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
 * Root - manages open/close state.
 *
 * Opened from a menu item or group label's menu, it keeps that
 * target highlighted for as long as it is open, so the popover
 * reads as belonging to the item it was opened from.
 */
export const Popover: React.FC<PopoverProps> = ({
  defaultOpen,
  onOpenChange,
  open,
  ...other
}) => {
  const menuTarget = useMenuTargetContext();
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    Boolean(defaultOpen),
  );

  // Controlled popovers are opened by their consumer rather than
  // by an interaction, so the open state is tracked rather than
  // read from the change handler
  const isOpen = open ?? uncontrolledOpen;

  // Hold the target the popover was opened from highlighted while
  // it is open
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    return menuTarget?.holdActionsVisible();
  }, [isOpen, menuTarget]);

  function handleOpenChange(
    nextOpen: boolean,
    eventDetails: PopoverPrimitive.Root.ChangeEventDetails,
  ) {
    setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen, eventDetails);
  }

  return (
    <PopoverPrimitive.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={handleOpenChange}
      {...other}
    />
  );
};

/*
 * Trigger - the element that opens the popover.
 * Accepts any renderable element via the render prop.
 */
export const PopoverTrigger = ({
  children,
  render,
  ...other
}: Omit<PopoverTriggerProps, 'children'> & {
  children?: React.ReactElement;
}) => <PopoverPrimitive.Trigger render={children || render} {...other} />;

PopoverTrigger.displayName = 'PopoverTrigger';

/*
 * Positioner - positions the popup relative to the trigger.
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
 * Content - the popup panel itself.
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
 * Close - a button that closes the popover.
 */
export const PopoverClose = PopoverPrimitive.Close;

/*
 * Portal - renders the popover outside the DOM hierarchy.
 */
export const PopoverPortal = PopoverPrimitive.Portal;
