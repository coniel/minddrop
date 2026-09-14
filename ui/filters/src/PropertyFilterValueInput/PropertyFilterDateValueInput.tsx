import { useEffect, useRef } from 'react';
import {
  Filters,
  PropertyFilterRelativeDatePreset,
  PropertyFilterValue,
} from '@minddrop/filters';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import {
  DateField,
  NumberField,
  Select,
  SelectOption,
  Stack,
} from '@minddrop/ui-primitives';

interface PropertyFilterDateValueInputProps {
  /**
   * The filter's current comparison value.
   */
  value?: PropertyFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: PropertyFilterValue | undefined): void;
}

// The selectable date options: relative presets, day ranges
// around the current day, and a custom absolute date.
type DateOption =
  | PropertyFilterRelativeDatePreset
  | 'last-days'
  | 'next-days'
  | 'custom';

// Builds date preset label translation keys
const dateI18nKey = createI18nKeyBuilder('filters.dates.');

// The selectable relative date presets, in display order
const RELATIVE_DATE_PRESETS: PropertyFilterRelativeDatePreset[] = [
  'today',
  'yesterday',
  'tomorrow',
  'one-week-ago',
  'one-week-from-now',
  'one-month-ago',
  'one-month-from-now',
];

/**
 * Renders a relative date preset picker with a day count field
 * for relative ranges and a date picker for custom absolute
 * dates.
 */
export const PropertyFilterDateValueInput: React.FC<
  PropertyFilterDateValueInputProps
> = ({ value, onChange }) => {
  // Debounces day count edits
  const daysTimeoutRef = useRef<number>(undefined);
  // The edited day count awaiting its pause in typing
  const pendingDaysRef = useRef<number | null>(null);

  // Drop a count still pending when the input unmounts, rather
  // than reporting it to an unmounted consumer.
  useEffect(() => () => window.clearTimeout(daysTimeoutRef.current), []);

  // The current date value, if set
  const dateValue = Filters.isDateValue(value) ? value : undefined;

  // The selected picker option
  let selected: DateOption | undefined;

  // Relative presets select their own option
  if (dateValue?.type === 'relative') {
    selected = dateValue.preset;
  }

  // Absolute dates select the custom option
  if (dateValue?.type === 'absolute') {
    selected = 'custom';
  }

  // Day ranges select their direction's option
  if (dateValue?.type === 'relative-range') {
    selected = dateValue.direction === 'past' ? 'last-days' : 'next-days';
  }

  // The picker options
  const options: SelectOption<DateOption>[] = [
    // Relative presets resolved when the filter runs
    ...RELATIVE_DATE_PRESETS.map((preset) => ({
      label: dateI18nKey(preset),
      value: preset,
    })),
    // Day ranges counted from the current day
    { label: dateI18nKey('last-days'), value: 'last-days' as const },
    { label: dateI18nKey('next-days'), value: 'next-days' as const },
    // Absolute date picked via the date field
    { label: dateI18nKey('custom'), value: 'custom' },
  ];

  // Reports the picked option as a date value
  function handleSelect(picked: DateOption): void {
    // Report a custom pick as an absolute date, defaulting to today
    if (picked === 'custom') {
      onChange({ type: 'absolute', date: new Date() });

      return;
    }

    // Report a day range pick, keeping the current count across
    // direction changes and defaulting to a week.
    if (picked === 'last-days' || picked === 'next-days') {
      onChange({
        type: 'relative-range',
        days: dateValue?.type === 'relative-range' ? dateValue.days : 7,
        direction: picked === 'last-days' ? 'past' : 'next',
      });

      return;
    }

    // Report the relative preset
    onChange({ type: 'relative', preset: picked });
  }

  // Persists the pending day count right away
  function flushPendingDays(): void {
    // Cancel the pending pause
    window.clearTimeout(daysTimeoutRef.current);

    // Report the pending count, if any
    if (
      pendingDaysRef.current !== null &&
      dateValue?.type === 'relative-range'
    ) {
      onChange({ ...dateValue, days: pendingDaysRef.current });
      pendingDaysRef.current = null;
    }
  }

  // Persists an edited day count after a short pause in typing
  function handleDaysChange(days: number | null): void {
    // Cancel the previous pause
    window.clearTimeout(daysTimeoutRef.current);

    // Keep the last count for cleared inputs
    if (days === null || dateValue?.type !== 'relative-range') {
      return;
    }

    // Report the count after the pause
    pendingDaysRef.current = days;
    daysTimeoutRef.current = window.setTimeout(flushPendingDays, 400);
  }

  // Reports a picked absolute date, treating cleared dates as
  // unset.
  function handleDateChange(date: Date | null): void {
    onChange(date ? { type: 'absolute', date } : undefined);
  }

  return (
    <Stack gap={2}>
      <Select<DateOption>
        placeholder="filters.fields.value"
        options={options}
        value={selected}
        onValueChange={handleSelect}
      />

      {/* Day count for relative ranges */}
      {dateValue?.type === 'relative-range' && (
        <NumberField
          size="md"
          min={1}
          defaultValue={dateValue.days}
          onValueChange={handleDaysChange}
          onBlur={flushPendingDays}
        />
      )}

      {/* Date picker for custom dates */}
      {dateValue?.type === 'absolute' && (
        <DateField
          size="md"
          value={dateValue.date}
          onValueChange={handleDateChange}
        />
      )}
    </Stack>
  );
};
