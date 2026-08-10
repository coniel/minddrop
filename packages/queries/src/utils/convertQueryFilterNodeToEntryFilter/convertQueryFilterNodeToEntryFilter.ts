import { EntryFilter, EntryFilterGroup } from '@minddrop/databases';
import { PropertyType } from '@minddrop/properties';
import { QueryDateValue, QueryFilterNode, QueryFilterValue } from '../../types';
import { isCompleteQueryFilterNode } from '../isCompleteQueryFilterNode';
import { resolveQueryDateRange } from '../resolveQueryDateRange';

/**
 * Converts a filter node's comparison into a SQL entry filter,
 * routed by the node's property type and resolving relative
 * date values into absolute ranges.
 *
 * Returns null for incomplete nodes and nodes whose operator or
 * value does not fit the property type.
 *
 * @param node - The filter node to convert.
 *
 * @returns The entry filter, or null when the node cannot compile.
 */
export function convertQueryFilterNodeToEntryFilter(
  node: QueryFilterNode,
): EntryFilter | EntryFilterGroup | null {
  // Skip nodes that are not fully configured
  if (!isCompleteQueryFilterNode(node)) {
    return null;
  }

  // Narrow the unset property type out of the union
  if (!node.propertyType) {
    return null;
  }

  const propertyType = node.propertyType;

  // Existence operators apply to all property types
  if (node.operator === 'is-empty' || node.operator === 'is-not-empty') {
    return {
      property: node.property,
      propertyType,
      operator: node.operator,
    };
  }

  // Toggle checks compile to integer comparisons, is-false
  // matches unset toggles via the negative operator
  if (propertyType === 'toggle') {
    return convertToggleFilter(node, propertyType);
  }

  // Date-like comparisons expand relative and absolute values
  // to day ranges
  if (
    propertyType === 'date' ||
    propertyType === 'created' ||
    propertyType === 'last-modified'
  ) {
    return convertDateFilter(node, propertyType);
  }

  // Collections compare against the picked entry ID lists
  if (propertyType === 'collection') {
    return convertCollectionFilter(node, propertyType);
  }

  // Select values compare via membership tests
  if (propertyType === 'select') {
    return convertSelectFilter(node, propertyType);
  }

  if (propertyType === 'number') {
    return convertNumberFilter(node, propertyType);
  }

  return convertTextFilter(node, propertyType);
}

/**
 * Converts a toggle comparison into an integer comparison filter.
 */
function convertToggleFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | null {
  if (node.operator === 'is-true') {
    return {
      property: node.property,
      propertyType,
      operator: 'number-equals',
      value: 1,
    };
  }

  if (node.operator === 'is-false') {
    return {
      property: node.property,
      propertyType,
      operator: 'number-not-equals',
      value: 1,
    };
  }

  return null;
}

/**
 * Converts a date comparison into epoch millisecond range
 * filters covering the value's local day.
 */
function convertDateFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | EntryFilterGroup | null {
  // The value must be a date value object
  if (!isQueryDateValue(node.value)) {
    return null;
  }

  const { start, end } = resolveQueryDateRange(node.value);
  const base = { property: node.property, propertyType };

  switch (node.operator) {
    // Within the day range
    case 'is':
      return {
        combinator: 'and',
        filters: [
          { ...base, operator: 'number-greater-than-or-equal', value: start },
          { ...base, operator: 'number-less-than', value: end },
        ],
      };
    case 'is-before':
      return { ...base, operator: 'number-less-than', value: start };
    case 'is-after':
      return { ...base, operator: 'number-greater-than-or-equal', value: end };
    case 'is-on-or-before':
      return { ...base, operator: 'number-less-than', value: end };
    case 'is-on-or-after':
      return {
        ...base,
        operator: 'number-greater-than-or-equal',
        value: start,
      };
    default:
      return null;
  }
}

/**
 * Converts a collection comparison into membership filters over
 * the picked entry IDs: any-of matches via OR, all-of and
 * none-of via AND.
 */
function convertCollectionFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | EntryFilterGroup | null {
  // The value must be a list of picked entry IDs
  if (!Array.isArray(node.value) || node.value.length === 0) {
    return null;
  }

  const base = { property: node.property, propertyType };

  if (node.operator === 'contains-any') {
    return groupEntryFilters(
      'or',
      node.value.map((entryId) => ({
        ...base,
        operator: 'has-value',
        value: entryId,
      })),
    );
  }

  if (node.operator === 'contains-all') {
    return groupEntryFilters(
      'and',
      node.value.map((entryId) => ({
        ...base,
        operator: 'has-value',
        value: entryId,
      })),
    );
  }

  if (node.operator === 'contains-none') {
    return groupEntryFilters(
      'and',
      node.value.map((entryId) => ({
        ...base,
        operator: 'not-has-value',
        value: entryId,
      })),
    );
  }

  return null;
}

/**
 * Wraps entry filters in a combinator group, returning a single
 * filter ungrouped.
 */
function groupEntryFilters(
  combinator: EntryFilterGroup['combinator'],
  filters: EntryFilter[],
): EntryFilter | EntryFilterGroup {
  // Single filters need no group
  if (filters.length === 1) {
    return filters[0];
  }

  return { combinator, filters };
}

/**
 * Converts a select comparison into a membership filter.
 */
function convertSelectFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | null {
  if (typeof node.value !== 'string') {
    return null;
  }

  const base = { property: node.property, propertyType };

  if (node.operator === 'is' || node.operator === 'contains') {
    return { ...base, operator: 'has-value', value: node.value };
  }

  if (node.operator === 'is-not' || node.operator === 'not-contains') {
    return { ...base, operator: 'not-has-value', value: node.value };
  }

  return null;
}

/**
 * Converts a number comparison into a numeric comparison filter.
 */
function convertNumberFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | null {
  if (typeof node.value !== 'number') {
    return null;
  }

  const base = { property: node.property, propertyType };

  switch (node.operator) {
    case 'equals':
      return { ...base, operator: 'number-equals', value: node.value };
    case 'not-equals':
      return { ...base, operator: 'number-not-equals', value: node.value };
    case 'greater-than':
      return { ...base, operator: 'number-greater-than', value: node.value };
    case 'greater-than-or-equal':
      return {
        ...base,
        operator: 'number-greater-than-or-equal',
        value: node.value,
      };
    case 'less-than':
      return { ...base, operator: 'number-less-than', value: node.value };
    case 'less-than-or-equal':
      return {
        ...base,
        operator: 'number-less-than-or-equal',
        value: node.value,
      };
    default:
      return null;
  }
}

/**
 * Converts a text comparison into a text comparison filter.
 */
function convertTextFilter(
  node: QueryFilterNode,
  propertyType: PropertyType,
): EntryFilter | null {
  if (typeof node.value !== 'string') {
    return null;
  }

  const base = { property: node.property, propertyType };

  switch (node.operator) {
    case 'equals':
      return { ...base, operator: 'text-equals', value: node.value };
    case 'not-equals':
      return { ...base, operator: 'text-not-equals', value: node.value };
    case 'contains':
      return { ...base, operator: 'text-contains', value: node.value };
    case 'not-contains':
      return { ...base, operator: 'text-not-contains', value: node.value };
    case 'starts-with':
      return { ...base, operator: 'text-starts-with', value: node.value };
    case 'ends-with':
      return { ...base, operator: 'text-ends-with', value: node.value };
    default:
      return null;
  }
}

/**
 * Checks whether a filter value is a date value object.
 */
function isQueryDateValue(
  value: QueryFilterValue | undefined,
): value is QueryDateValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
