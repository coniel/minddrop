import { PropertyValue } from '@minddrop/properties';
import { toArray } from '@minddrop/utils';
import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
} from '../../constants';
import { PropertyFilter } from '../../types';
import { isPropertyFilterDateValue } from '../isPropertyFilterDateValue';
import { resolvePropertyFilterDateRange } from '../resolvePropertyFilterDateRange';

/**
 * Checks whether a property value matches a filter.
 *
 * @param value - The property value to test.
 * @param filter - The filter to test the value against.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns Whether the value matches the filter.
 */
export function matchesPropertyFilter(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
  now: Date = new Date(),
): boolean {
  // Operators outside the property type's set never match
  if (!isSupportedOperator(filter)) {
    return false;
  }

  // Test emptiness, which applies to all property types
  if (filter.operator === 'is-empty') {
    return isEmptyValue(value);
  }

  // Test non-emptiness
  if (filter.operator === 'is-not-empty') {
    return !isEmptyValue(value);
  }

  // Compare by the property type
  const { propertyType } = filter;

  // Compare toggles
  if (propertyType === 'toggle') {
    return matchesToggle(value, filter);
  }

  // Compare dates
  if (
    propertyType === 'date' ||
    propertyType === 'created' ||
    propertyType === 'last-modified'
  ) {
    return matchesDate(value, filter, now);
  }

  // Compare select values
  if (propertyType === 'select') {
    return matchesSelect(value, filter);
  }

  // Compare tag and collection lists
  if (propertyType === 'tags' || propertyType === 'collection') {
    return matchesList(value, filter);
  }

  // Compare numbers
  if (propertyType === 'number') {
    return matchesNumber(value, filter);
  }

  // Compare text
  return matchesText(value, filter);
}

/**
 * Checks whether the property type supports the filter's
 * operator.
 */
function isSupportedOperator(filter: PropertyFilter): boolean {
  // Look up the property type's operators
  const operators =
    PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE[filter.propertyType];

  // Check the type's own operators
  if (operators.includes(filter.operator)) {
    return true;
  }

  // Select properties also accept the multiselect operators
  return (
    filter.propertyType === 'select' &&
    MULTISELECT_PROPERTY_FILTER_OPERATORS.includes(filter.operator)
  );
}

/**
 * Checks whether a property value is empty.
 */
function isEmptyValue(value: PropertyValue | undefined): boolean {
  // Unset values are empty
  if (value === null || value === undefined) {
    return true;
  }

  // Empty strings are empty
  if (value === '') {
    return true;
  }

  // Empty lists are empty
  return Array.isArray(value) && value.length === 0;
}

/**
 * Checks a toggle value.
 */
function matchesToggle(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  // Match set toggles
  if (filter.operator === 'is-true') {
    return value === true;
  }

  // Unset toggles count as off
  return value !== true;
}

/**
 * Checks a date value.
 */
function matchesDate(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
  now: Date,
): boolean {
  // Only dates compare against date values
  if (!(value instanceof Date) || !isPropertyFilterDateValue(filter.value)) {
    return false;
  }

  // Resolve the day range the filter covers
  const time = value.getTime();
  const { start, end } = resolvePropertyFilterDateRange(filter.value, now);

  // Compare the value against the range
  switch (filter.operator) {
    case 'is':
      return time >= start && time < end;
    case 'is-before':
      return time < start;
    case 'is-after':
      return time >= end;
    case 'is-on-or-before':
      return time < end;
    case 'is-on-or-after':
      return time >= start;
    default:
      return false;
  }
}

/**
 * Checks a select value. Several picked options match any of
 * them for positive operators and none of them for negative ones.
 */
function matchesSelect(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  // Only option names compare against select values
  if (typeof filter.value !== 'string' && !Array.isArray(filter.value)) {
    return false;
  }

  // Normalize both sides to option lists
  const selected = toArray(value);
  const picked = toArray(filter.value);

  // Nothing picked matches nothing
  if (picked.length === 0) {
    return false;
  }

  // Check whether any picked option is selected
  const hasPicked = picked.some((option) => selected.includes(option));

  // Positive operators match any picked option
  if (filter.operator === 'is' || filter.operator === 'contains') {
    return hasPicked;
  }

  // Negative operators match none of them
  if (filter.operator === 'is-not' || filter.operator === 'not-contains') {
    return !hasPicked;
  }

  // Other operators never match
  return false;
}

/**
 * Checks a tags or collection value.
 */
function matchesList(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  // Only non-empty picks compare against lists
  if (!Array.isArray(filter.value) || filter.value.length === 0) {
    return false;
  }

  // Normalize the value to a list
  const items = toArray(value);
  const picked = filter.value;

  // Match any picked item
  if (filter.operator === 'contains-any') {
    return picked.some((item) => items.includes(item));
  }

  // Match every picked item
  if (filter.operator === 'contains-all') {
    return picked.every((item) => items.includes(item));
  }

  // Match none of the picked items
  if (filter.operator === 'contains-none') {
    return !picked.some((item) => items.includes(item));
  }

  // Other operators never match
  return false;
}

/**
 * Checks a number value.
 */
function matchesNumber(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  // Only numbers compare against number values
  if (typeof filter.value !== 'number') {
    return false;
  }

  // Values that are not numbers only satisfy the negative
  // comparison, as an unset value is not equal to anything.
  if (typeof value !== 'number') {
    return filter.operator === 'not-equals';
  }

  // Compare the numbers
  switch (filter.operator) {
    case 'equals':
      return value === filter.value;
    case 'not-equals':
      return value !== filter.value;
    case 'greater-than':
      return value > filter.value;
    case 'greater-than-or-equal':
      return value >= filter.value;
    case 'less-than':
      return value < filter.value;
    case 'less-than-or-equal':
      return value <= filter.value;
    default:
      return false;
  }
}

/**
 * Checks a text value.
 */
function matchesText(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  // Only text compares against text values
  if (typeof filter.value !== 'string') {
    return false;
  }

  // Values that are not text only satisfy the negative
  // comparisons, as an unset value equals and contains nothing.
  if (typeof value !== 'string') {
    return (
      filter.operator === 'not-equals' || filter.operator === 'not-contains'
    );
  }

  // Compare case insensitively
  const text = value.toLocaleLowerCase();
  const expected = filter.value.toLocaleLowerCase();

  // Compare the text
  switch (filter.operator) {
    case 'equals':
      return text === expected;
    case 'not-equals':
      return text !== expected;
    case 'contains':
      return text.includes(expected);
    case 'not-contains':
      return !text.includes(expected);
    case 'starts-with':
      return text.startsWith(expected);
    case 'ends-with':
      return text.endsWith(expected);
    default:
      return false;
  }
}
