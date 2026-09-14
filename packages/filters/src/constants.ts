import { PropertyType } from '@minddrop/properties';
import { PropertyFilterOperator } from './types';

// Text comparison operators shared by text-like property types
const TEXT_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'equals',
  'not-equals',
  'contains',
  'not-contains',
  'starts-with',
  'ends-with',
  'is-empty',
  'is-not-empty',
];

// Date comparison operators shared by date-like property types
const DATE_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'is',
  'is-before',
  'is-after',
  'is-on-or-before',
  'is-on-or-after',
];

/**
 * The filter operators available for multiselect select
 * properties.
 */
export const MULTISELECT_PROPERTY_FILTER_OPERATORS: PropertyFilterOperator[] = [
  'contains',
  'not-contains',
  'is-empty',
  'is-not-empty',
];

/**
 * The filter operators available for each property type.
 * Multiselect select properties use
 * MULTISELECT_PROPERTY_FILTER_OPERATORS instead.
 */
export const PROPERTY_FILTER_OPERATORS_BY_PROPERTY_TYPE: Record<
  PropertyType,
  PropertyFilterOperator[]
> = {
  // Title always has a value, no existence operators
  title: [
    'equals',
    'not-equals',
    'contains',
    'not-contains',
    'starts-with',
    'ends-with',
  ],
  text: TEXT_FILTER_OPERATORS,
  content: TEXT_FILTER_OPERATORS,
  url: TEXT_FILTER_OPERATORS,
  // Icons and file based properties only support existence tests
  icon: ['is-empty', 'is-not-empty'],
  file: ['is-empty', 'is-not-empty'],
  image: ['is-empty', 'is-not-empty'],
  number: [
    'equals',
    'not-equals',
    'greater-than',
    'greater-than-or-equal',
    'less-than',
    'less-than-or-equal',
    'is-empty',
    'is-not-empty',
  ],
  date: [...DATE_FILTER_OPERATORS, 'is-empty', 'is-not-empty'],
  // Created/last-modified always have a value, no existence
  // operators.
  created: DATE_FILTER_OPERATORS,
  'last-modified': DATE_FILTER_OPERATORS,
  toggle: ['is-true', 'is-false'],
  select: ['is', 'is-not', 'is-empty', 'is-not-empty'],
  // Tags test membership of the picked tags
  tags: [
    'contains-any',
    'contains-all',
    'contains-none',
    'is-empty',
    'is-not-empty',
  ],
  // Color values cannot be compared yet
  color: [],
  // Collections test membership of the picked items
  collection: [
    'contains-any',
    'contains-all',
    'contains-none',
    'is-empty',
    'is-not-empty',
  ],
};

/**
 * Filter operators that do not take a comparison value.
 */
export const VALUE_LESS_PROPERTY_FILTER_OPERATORS =
  new Set<PropertyFilterOperator>([
    'is-empty',
    'is-not-empty',
    'is-true',
    'is-false',
  ]);
