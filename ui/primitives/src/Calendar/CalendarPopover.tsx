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

type PopoverOnOpenChange = NonNullable<PopoverProps['onOpenChange']>;
type PopoverEventDetails = Parameters<PopoverOnOpenChange>[1];

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

  const handleOpenChange: PopoverOnOpenChange = useCallback(
    (nextOpen, eventDetails) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen, eventDetails);
    },
    [isControlled, onOpenChange],
  );

  const { onSelect } = calendarProps as CalendarProps & {
    onSelect?: (...args: unknown[]) => void;
  };
  const handleSelect = useCallback(
    (...args: unknown[]) => {
      onSelect?.(...args);

      if (closeOnSelect) {
        if (!isControlled) {
          setInternalOpen(false);
        }

        // Notify consumer for controlled mode (no DOM event available here)
        onOpenChange?.(false, undefined as unknown as PopoverEventDetails);
      }
    },
    [onSelect, closeOnSelect, isControlled, onOpenChange],
  );

  // Merge onSelect override outside JSX to satisfy DayPickerProps discriminated union
  const mergedCalendarProps = {
    ...(calendarProps as object),
    onSelect: handleSelect,
  } as CalendarProps;

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
            <Calendar {...mergedCalendarProps} />
          </PopoverContent>
        </PopoverPositioner>
      </PopoverPortal>
    </Popover>
  );
};

CalendarPopover.displayName = 'CalendarPopover';
