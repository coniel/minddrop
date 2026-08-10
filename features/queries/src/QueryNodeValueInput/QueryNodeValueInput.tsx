import { useMemo, useRef } from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { createI18nKeyBuilder, useTranslation } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import {
  QueryDateValue,
  QueryFilterValue,
  QueryOperator,
  QueryRelativeDatePreset,
  VALUE_LESS_QUERY_OPERATORS,
} from '@minddrop/queries';
import {
  Combobox,
  ComboboxOption,
  DateField,
  NumberField,
  Select,
  SelectOption,
  Stack,
  TextInput,
} from '@minddrop/ui-primitives';
import { SOURCE_FALLBACK_ICON } from '../constants';

export interface QueryNodeValueInputProps {
  /**
   * The schema of the filter's selected property.
   */
  property: PropertySchema;

  /**
   * The filter's comparison operator.
   */
  operator: QueryOperator | '';

  /**
   * The filter's current comparison value.
   */
  value?: QueryFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: QueryFilterValue | undefined): void;
}

// Builds date preset label translation keys
const dateI18nKey = createI18nKeyBuilder('queries.dates.');

// The selectable relative date presets, in display order
const RELATIVE_DATE_PRESETS: QueryRelativeDatePreset[] = [
  'today',
  'yesterday',
  'tomorrow',
  'one-week-ago',
  'one-week-from-now',
  'one-month-ago',
  'one-month-from-now',
];

/**
 * Renders the comparison value input matching a filter's
 * property type. Renders nothing for value-less operators.
 */
export const QueryNodeValueInput: React.FC<QueryNodeValueInputProps> = ({
  property,
  operator,
  value,
  onChange,
}) => {
  const debounceTimeoutRef = useRef<number>(undefined);

  // Value-less operators take no input
  if (!operator || VALUE_LESS_QUERY_OPERATORS.has(operator)) {
    return null;
  }

  // Persists a typed value after a short pause in typing
  function handleDebouncedChange(newValue: QueryFilterValue | undefined): void {
    window.clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = window.setTimeout(() => {
      onChange(newValue);
    }, 400);
  }

  // Persists a number value, treating cleared inputs as unset
  function handleNumberChange(newValue: number | null): void {
    handleDebouncedChange(newValue === null ? undefined : newValue);
  }

  // Date-like properties pick a relative preset or absolute date
  if (
    property.type === 'date' ||
    property.type === 'created' ||
    property.type === 'last-modified'
  ) {
    return <QueryNodeDateValueInput value={value} onChange={onChange} />;
  }

  // Collection properties pick the entries compared against
  // the collection's members
  if (property.type === 'collection') {
    return <QueryNodeEntryValueInput value={value} onChange={onChange} />;
  }

  // Select properties pick from the property's options
  if (property.type === 'select') {
    return (
      <Select
        placeholder="queries.editor.selectValue"
        options={property.options.map((option) => ({
          stringLabel: option.value,
          value: option.value,
        }))}
        value={typeof value === 'string' ? value : undefined}
        onValueChange={onChange}
      />
    );
  }

  if (property.type === 'number') {
    return (
      <NumberField
        size="md"
        defaultValue={typeof value === 'number' ? value : undefined}
        onValueChange={handleNumberChange}
      />
    );
  }

  // Text-like property types use a plain text input
  return (
    <TextInput
      size="md"
      placeholder="queries.editor.valuePlaceholder"
      defaultValue={typeof value === 'string' ? value : undefined}
      onValueChange={handleDebouncedChange}
    />
  );
};

interface QueryNodeEntryValueInputProps {
  /**
   * The filter's current comparison value.
   */
  value?: QueryFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: QueryFilterValue | undefined): void;
}

/**
 * Renders a searchable multi entry picker for collection
 * membership comparisons, listing all database entries as
 * options and showing the picked entries as chips.
 */
const QueryNodeEntryValueInput: React.FC<QueryNodeEntryValueInputProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation({ keyPrefix: 'queries' });

  // Subscribe to entry changes so the options stay fresh
  const entries = DatabaseEntries.Store.useAllItemsArray();

  // The picked entry IDs
  const pickedIds = Array.isArray(value) ? value : [];

  // Entries as options, alphabetical, icon'd by the database
  // they belong to
  const options = useMemo<ComboboxOption[]>(
    () =>
      [...entries]
        .sort((entryA, entryB) => entryA.title.localeCompare(entryB.title))
        .map((entry) => ({
          label: entry.title,
          value: entry.id,
          contentIcon:
            Databases.get(entry.database, false)?.icon || SOURCE_FALLBACK_ICON,
        })),
    [entries],
  );

  // The picked entries' options, shown as chips
  const selected = options.filter((option) => pickedIds.includes(option.value));

  // Persist the picked entries' IDs, treating cleared picks as
  // unset
  function handleValueChange(
    picked: ComboboxOption | ComboboxOption[] | null,
  ): void {
    // Single values never occur in multi-select mode
    if (!Array.isArray(picked)) {
      return;
    }

    onChange(picked.length ? picked.map((option) => option.value) : undefined);
  }

  return (
    <Combobox
      multiple
      size="md"
      items={options}
      placeholder={t('editor.selectValue')}
      searchPlaceholder="queries.editor.searchEntries"
      emptyText={t('results.empty')}
      value={selected}
      onValueChange={handleValueChange}
    />
  );
};

interface QueryNodeDateValueInputProps {
  /**
   * The filter's current comparison value.
   */
  value?: QueryFilterValue;

  /**
   * Callback fired with the new value.
   */
  onChange(value: QueryFilterValue | undefined): void;
}

// The selectable date options: relative presets, day ranges
// around the current day, and a custom absolute date
type QueryDateOption =
  | QueryRelativeDatePreset
  | 'last-days'
  | 'next-days'
  | 'custom';

/**
 * Renders a relative date preset picker with a day count field
 * for relative ranges and a date picker for custom absolute
 * dates.
 */
const QueryNodeDateValueInput: React.FC<QueryNodeDateValueInputProps> = ({
  value,
  onChange,
}) => {
  // Debounces day count edits
  const daysTimeoutRef = useRef<number>(undefined);

  // The current date value, if set
  const dateValue = isQueryDateValue(value) ? value : undefined;

  // The selected picker option
  let selected: QueryDateOption | undefined;

  if (dateValue?.type === 'relative') {
    selected = dateValue.preset;
  }

  if (dateValue?.type === 'absolute') {
    selected = 'custom';
  }

  // Day ranges map to their direction's option
  if (dateValue?.type === 'relative-range') {
    selected = dateValue.direction === 'past' ? 'last-days' : 'next-days';
  }

  const options: SelectOption<QueryDateOption>[] = [
    // Relative presets resolved at query run time
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

  // Persist the picked option, defaulting custom to today and
  // day ranges to a week, keeping the count across direction
  // changes
  function handleSelect(picked: QueryDateOption): void {
    if (picked === 'custom') {
      onChange({ type: 'absolute', date: new Date() });

      return;
    }

    if (picked === 'last-days' || picked === 'next-days') {
      onChange({
        type: 'relative-range',
        days: dateValue?.type === 'relative-range' ? dateValue.days : 7,
        direction: picked === 'last-days' ? 'past' : 'next',
      });

      return;
    }

    onChange({ type: 'relative', preset: picked });
  }

  // Persist an edited day count after a short pause in typing,
  // keeping the last count for cleared inputs
  function handleDaysChange(days: number | null): void {
    window.clearTimeout(daysTimeoutRef.current);

    if (days === null || dateValue?.type !== 'relative-range') {
      return;
    }

    daysTimeoutRef.current = window.setTimeout(() => {
      onChange({ ...dateValue, days });
    }, 400);
  }

  // Persist a picked absolute date, treating cleared dates as
  // unset
  function handleDateChange(date: Date | null): void {
    onChange(date ? { type: 'absolute', date } : undefined);
  }

  return (
    <Stack gap={2}>
      <Select<QueryDateOption>
        placeholder="queries.editor.selectValue"
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
        />
      )}

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

/**
 * Checks whether a filter value is a date value object.
 */
function isQueryDateValue(
  value: QueryFilterValue | undefined,
): value is QueryDateValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
