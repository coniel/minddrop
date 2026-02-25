import React, { useCallback, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverPositioner,
  PopoverPositionerProps,
  PopoverProps,
  PopoverTrigger,
} from '../Popover';
import { CalendarProps } from './Calendar';
import { Calendar } from './Calendar';

type PickedRootProps = Pick<
  PopoverProps,
  'open' | 'onOpenChange' | 'defaultOpen'
>;
type PickedPositionerProps = Pick<
  PopoverPositionerProps,
  'side' | 'align' | 'sideOffset' | 'alignOffset'
>;

export type CalendarPopoverProps = PickedRootProps &
  PickedPositionerProps &
  CalendarProps & {
    children: React.ReactElement;
    /**
     * Close the popover when a date is selected.
     * @default true
     */
    closeOnSelect?: boolean;
  };

export const CalendarPopover = ({
  // Popover root props
  open: controlledOpen,
  onOpenChange,
  defaultOpen,
  // Positioner props
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset,
  // CalendarPopover-specific
  children,
  closeOnSelect = true,
  // Everything else goes to Calendar
  ...calendarProps
}: CalendarPopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean, event?: Event, reason?: string) => {
      if (!isControlled) setInternalOpen(nextOpen);
      onOpenChange?.(nextOpen, event, reason);
    },
    [isControlled, onOpenChange],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { onSelect } = calendarProps as any;
  const handleSelect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      onSelect?.(...args);
      if (closeOnSelect) handleOpenChange(false);
    },
    [onSelect, closeOnSelect, handleOpenChange],
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverPortal>
        <PopoverPositioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <PopoverContent>
            <Calendar
              {...(calendarProps as CalendarProps)}
              onSelect={handleSelect}
            />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

CalendarPopover.displayName = 'CalendarPopover';
