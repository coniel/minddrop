import { toArray } from '@minddrop/utils';
import {
  MULTISELECT_PROPERTY_FILTER_OPERATORS,
  PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE,
} from '../../constants';
import { PropertyFilter, PropertyValue } from '../../types';
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

  // Existence tests apply to all property types
  if (filter.operator === 'is-empty') {
    return isEmptyValue(value);
  }

  if (filter.operator === 'is-not-empty') {
    return !isEmptyValue(value);
  }

  const { propertyType } = filter;

  if (propertyType === 'toggle') {
    return matchesToggle(value, filter);
  }

  if (
    propertyType === 'date' ||
    propertyType === 'created' ||
    propertyType === 'last-modified'
  ) {
    return matchesDate(value, filter, now);
  }

  if (propertyType === 'select') {
    return matchesSelect(value, filter);
  }

  if (propertyType === 'tags' || propertyType === 'collection') {
    return matchesList(value, filter);
  }

  if (propertyType === 'number') {
    return matchesNumber(value, filter);
  }

  return matchesText(value, filter);
}

/**
 * Checks whether the property type supports the filter's
 * operator. Select properties also accept the multiselect
 * operators.
 */
function isSupportedOperator(filter: PropertyFilter): boolean {
  const operators =
    PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE[filter.propertyType];

  if (operators.includes(filter.operator)) {
    return true;
  }

  return (
    filter.propertyType === 'select' &&
    MULTISELECT_PROPERTY_FILTER_OPERATORS.includes(filter.operator)
  );
}

/**
 * Checks whether a property value is empty.
 */
function isEmptyValue(value: PropertyValue | undefined): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (value === '') {
    return true;
  }

  return Array.isArray(value) && value.length === 0;
}

/**
 * Checks a toggle value.
 */
function matchesToggle(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  if (filter.operator === 'is-true') {
    return value === true;
  }

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
  if (!(value instanceof Date) || !isPropertyFilterDateValue(filter.value)) {
    return false;
  }

  const time = value.getTime();
  const { start, end } = resolvePropertyFilterDateRange(filter.value, now);

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
 * Checks a select value.
 */
function matchesSelect(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  if (typeof filter.value !== 'string') {
    return false;
  }

  const selected = toArray(value);

  if (filter.operator === 'is' || filter.operator === 'contains') {
    return selected.includes(filter.value);
  }

  if (filter.operator === 'is-not' || filter.operator === 'not-contains') {
    return !selected.includes(filter.value);
  }

  return false;
}

/**
 * Checks a tags or collection value.
 */
function matchesList(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  if (!Array.isArray(filter.value) || filter.value.length === 0) {
    return false;
  }

  const items = toArray(value);
  const picked = filter.value;

  if (filter.operator === 'contains-any') {
    return picked.some((item) => items.includes(item));
  }

  if (filter.operator === 'contains-all') {
    return picked.every((item) => items.includes(item));
  }

  if (filter.operator === 'contains-none') {
    return !picked.some((item) => items.includes(item));
  }

  return false;
}

/**
 * Checks a number value.
 */
function matchesNumber(
  value: PropertyValue | undefined,
  filter: PropertyFilter,
): boolean {
  if (typeof filter.value !== 'number') {
    return false;
  }

  // Values that are not numbers only satisfy the negative
  // comparison, as an unset value is not equal to anything.
  if (typeof value !== 'number') {
    return filter.operator === 'not-equals';
  }

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

  const text = value.toLocaleLowerCase();
  const expected = filter.value.toLocaleLowerCase();

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
