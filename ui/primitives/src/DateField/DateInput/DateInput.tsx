import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from '@minddrop/i18n';
import {
  CalendarPopover,
  CalendarPopoverProps,
} from '../../Calendar/CalendarPopover';
import { Icon } from '../../Icon';
import { IconButton } from '../../IconButton';
import type { TextInputSize, TextInputVariant } from '../../fields/TextInput';
import { propsToClass } from '../../utils';
import './DateInput.css';

export type DateInputVariant = TextInputVariant;
export type DateInputSize = TextInputSize;

export interface DateInputProps {
  /**
   * Class name applied to the root element.
   */
  className?: string;

  /**
   * Visual style of the input.
   * @default 'outline'
   */
  variant?: DateInputVariant;

  /**
   * Height of the input.
   * @default 'lg'
   */
  size?: DateInputSize;

  /**
   * The currently selected date.
   */
  value?: Date | null;

  /**
   * Default date for uncontrolled usage.
   */
  defaultValue?: Date | null;

  /**
   * Callback fired when the selected date changes.
   */
  onValueChange?: (date: Date | null) => void;

  /**
   * Placeholder text. Can be an i18n key.
   */
  placeholder?: string;

  /**
   * Marks the input as invalid (applies error styling).
   */
  invalid?: boolean;

  /**
   * Disables the input.
   */
  disabled?: boolean;

  /**
   * Whether the date can be cleared.
   */
  clearable?: boolean;

  /**
   * Format function for displaying the date.
   * Receives the date and the current locale string.
   * @default Intl.DateTimeFormat with medium date style
   */
  formatDate?: (date: Date, locale: string) => string;

  /**
   * Props forwarded to the CalendarPopover positioning.
   */
  side?: CalendarPopoverProps['side'];

  /**
   * Alignment of the calendar popover.
   */
  align?: CalendarPopoverProps['align'];
}

/** Renders a date input that opens a calendar popover on click. */
export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      className,
      variant = 'outline',
      size = 'lg',
      value,
      defaultValue,
      onValueChange,
      placeholder,
      invalid,
      disabled,
      clearable,
      formatDate,
      side,
      align,
    },
    ref,
  ) => {
    const { t, i18n } = useTranslation();

    // Track internal state for uncontrolled usage
    const [internalValue, setInternalValue] = useState<Date | null>(
      defaultValue ?? null,
    );
    const isControlled = value !== undefined;
    const selectedDate = isControlled ? value : internalValue;

    const triggerRef = useRef<HTMLDivElement>(null);

    // Format the selected date for display
    const displayText = useMemo(() => {
      if (!selectedDate) {
        return '';
      }

      if (formatDate) {
        return formatDate(selectedDate, i18n.language);
      }

      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: 'medium',
      }).format(selectedDate);
    }, [selectedDate, formatDate, i18n.language]);

    // Handle date selection from the calendar
    const handleSelect = useCallback(
      (date: Date | undefined) => {
        const newDate = date ?? null;

        if (!isControlled) {
          setInternalValue(newDate);
        }

        onValueChange?.(newDate);
      },
      [isControlled, onValueChange],
    );

    // Handle clearing the date
    const handleClear = useCallback(
      (event: React.MouseEvent) => {
        event.stopPropagation();

        if (!isControlled) {
          setInternalValue(null);
        }

        onValueChange?.(null);
      },
      [isControlled, onValueChange],
    );

    const hasValue = clearable && !disabled && selectedDate !== null;

    const trigger = (
      <div
        ref={ref}
        className={[
          propsToClass('date-input', {
            disabled,
            empty: !selectedDate,
            className,
          }),
          propsToClass('text-input', { variant, size, invalid }),
        ]
          .filter(Boolean)
          .join(' ')}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
      >
        {/* Calendar icon */}
        <div className="text-input-leading">
          <Icon name="calendar" />
        </div>

        {/* Display text or placeholder */}
        <span className="text-input-input date-input-text" ref={triggerRef}>
          {displayText ||
            (placeholder ? (t as (key: string) => string)(placeholder) : '')}
        </span>

        {/* Clear button */}
        {hasValue && (
          <IconButton
            className="text-input-clear"
            icon="x"
            label="actions.clear"
            size="sm"
            color="muted"
            onClick={handleClear}
          />
        )}
      </div>
    );

    // When disabled, render without the popover
    if (disabled) {
      return trigger;
    }

    return (
      <CalendarPopover
        mode="single"
        selected={selectedDate ?? undefined}
        onSelect={handleSelect}
        side={side}
        align={align}
      >
        {trigger}
      </CalendarPopover>
    );
  },
);

DateInput.displayName = 'DateInput';
