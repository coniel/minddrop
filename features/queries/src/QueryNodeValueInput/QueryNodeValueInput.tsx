import { useRef } from 'react';
import { createI18nKeyBuilder } from '@minddrop/i18n';
import { PropertySchema } from '@minddrop/properties';
import {
  QueryDateValue,
  QueryFilterValue,
  QueryOperator,
  QueryRelativeDatePreset,
  VALUE_LESS_QUERY_OPERATORS,
} from '@minddrop/queries';
import {
  DateField,
  Group,
  NumberField,
  Select,
  SelectOption,
  TextInput,
} from '@minddrop/ui-primitives';

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
        defaultValue={typeof value === 'number' ? value : undefined}
        onValueChange={handleNumberChange}
      />
    );
  }

  // Text-like property types use a plain text input
  return (
    <TextInput
      placeholder="queries.editor.valuePlaceholder"
      defaultValue={typeof value === 'string' ? value : undefined}
      onValueChange={handleDebouncedChange}
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

/**
 * Renders a relative date preset picker with a date picker for
 * custom absolute dates.
 */
const QueryNodeDateValueInput: React.FC<QueryNodeDateValueInputProps> = ({
  value,
  onChange,
}) => {
  // The current date value, if set
  const dateValue = isQueryDateValue(value) ? value : undefined;

  // The selected picker option
  let selected: QueryRelativeDatePreset | 'custom' | undefined;

  if (dateValue?.type === 'relative') {
    selected = dateValue.preset;
  }

  if (dateValue?.type === 'absolute') {
    selected = 'custom';
  }

  const options: SelectOption<QueryRelativeDatePreset | 'custom'>[] = [
    // Relative presets resolved at query run time
    ...RELATIVE_DATE_PRESETS.map((preset) => ({
      label: dateI18nKey(preset),
      value: preset,
    })),
    // Absolute date picked via the date field
    { label: dateI18nKey('custom'), value: 'custom' },
  ];

  // Persist the picked preset, defaulting custom to today
  function handleSelect(picked: QueryRelativeDatePreset | 'custom'): void {
    if (picked === 'custom') {
      onChange({ type: 'absolute', date: new Date() });

      return;
    }

    onChange({ type: 'relative', preset: picked });
  }

  // Persist a picked absolute date, treating cleared dates as
  // unset
  function handleDateChange(date: Date | null): void {
    onChange(date ? { type: 'absolute', date } : undefined);
  }

  return (
    <Group gap={2}>
      <Select<QueryRelativeDatePreset | 'custom'>
        placeholder="queries.editor.selectValue"
        options={options}
        value={selected}
        onValueChange={handleSelect}
      />
      {dateValue?.type === 'absolute' && (
        <DateField value={dateValue.date} onValueChange={handleDateChange} />
      )}
    </Group>
  );
};

/**
 * Checks whether a filter value is a date value object.
 */
function isQueryDateValue(
  value: QueryFilterValue | undefined,
): value is QueryDateValue {
  return typeof value === 'object' && value !== null;
}
