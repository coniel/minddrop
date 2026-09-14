import { useEffect, useRef } from 'react';
import { Filters, PropertyFilterValue } from '@minddrop/filters';
import { NumberField, TextInput } from '@minddrop/ui-primitives';
import { TagsSelectField } from '@minddrop/ui-tags';
import { PropertyFilterValueInputProps } from '../types';
import { PropertyFilterCollectionValueInput } from './PropertyFilterCollectionValueInput';
import { PropertyFilterDateValueInput } from './PropertyFilterDateValueInput';
import { PropertyFilterSelectValueInput } from './PropertyFilterSelectValueInput';

/**
 * Renders the comparison value input matching a filter's
 * property type. Renders nothing for value-less operators.
 */
export const PropertyFilterValueInput: React.FC<
  PropertyFilterValueInputProps
> = ({ property, operator, value, onChange }) => {
  // Debounces typed values
  const debounceTimeoutRef = useRef<number>(undefined);
  // The typed value awaiting its pause in typing
  const pendingRef = useRef<{ value: PropertyFilterValue | undefined }>(null);

  // Drop a value still pending when the input unmounts, rather
  // than reporting it to an unmounted consumer.
  useEffect(() => () => window.clearTimeout(debounceTimeoutRef.current), []);

  // Value-less operators take no input
  if (!operator || Filters.constants.ValueLessOperators.has(operator)) {
    return null;
  }

  // Persists the pending typed value right away
  function flushPendingChange(): void {
    // Cancel the pending pause
    window.clearTimeout(debounceTimeoutRef.current);

    // Report the pending value, if any
    if (pendingRef.current) {
      onChange(pendingRef.current.value);
      pendingRef.current = null;
    }
  }

  // Persists a typed value after a short pause in typing
  function handleDebouncedChange(
    newValue: PropertyFilterValue | undefined,
  ): void {
    // Restart the pause with the new value
    window.clearTimeout(debounceTimeoutRef.current);
    pendingRef.current = { value: newValue };

    // Report the value after the pause
    debounceTimeoutRef.current = window.setTimeout(flushPendingChange, 400);
  }

  // Persists a number value, treating cleared inputs as unset
  function handleNumberChange(newValue: number | null): void {
    handleDebouncedChange(newValue === null ? undefined : newValue);
  }

  // Persists picked tag names, treating cleared picks as unset
  function handleTagsChange(names: string[]): void {
    onChange(names.length ? names : undefined);
  }

  // Collection properties pick the items compared against the
  // collection's members.
  if (property.type === 'collection') {
    return (
      <PropertyFilterCollectionValueInput value={value} onChange={onChange} />
    );
  }

  // Date-like properties pick a relative preset or absolute date
  if (
    property.type === 'date' ||
    property.type === 'created' ||
    property.type === 'last-modified'
  ) {
    return <PropertyFilterDateValueInput value={value} onChange={onChange} />;
  }

  // Tags properties pick the tags compared against, limited to
  // the property's group when one is set.
  if (property.type === 'tags') {
    return (
      <TagsSelectField
        size="md"
        group={property.group}
        placeholder="filters.fields.value"
        value={Array.isArray(value) ? value : []}
        onChange={handleTagsChange}
      />
    );
  }

  // Select properties check any number of the property's options
  if (property.type === 'select') {
    return (
      <PropertyFilterSelectValueInput
        options={property.options}
        value={value}
        onChange={onChange}
      />
    );
  }

  // Number properties type a number
  if (property.type === 'number') {
    return (
      <NumberField
        size="md"
        defaultValue={typeof value === 'number' ? value : undefined}
        onValueChange={handleNumberChange}
        onBlur={flushPendingChange}
      />
    );
  }

  // Text-like property types use a plain text input
  return (
    <TextInput
      size="md"
      placeholder="filters.fields.value"
      defaultValue={typeof value === 'string' ? value : undefined}
      onValueChange={handleDebouncedChange}
      onBlur={flushPendingChange}
    />
  );
};
