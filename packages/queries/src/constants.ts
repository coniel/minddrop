import type { PropertyType } from '@minddrop/properties';
import type { QueryOperator } from './types';

export const QueriesDirName = 'queries';
export const QueryFileExtension = 'query';

// Text comparison operators shared by text-like property types
const TEXT_OPERATORS: QueryOperator[] = [
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
const DATE_OPERATORS: QueryOperator[] = [
  'is',
  'is-before',
  'is-after',
  'is-on-or-before',
  'is-on-or-after',
];

// The operators available for each property type. Multiselect
// select properties use MULTISELECT_QUERY_OPERATORS instead.
export const QUERY_OPERATORS_BY_PROPERTY_TYPE: Record<
  PropertyType,
  QueryOperator[]
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
  text: TEXT_OPERATORS,
  'formatted-text': TEXT_OPERATORS,
  url: TEXT_OPERATORS,
  // File based properties only support existence tests
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
  date: [...DATE_OPERATORS, 'is-empty', 'is-not-empty'],
  // Created/last-modified always have a value, no existence
  // operators
  created: DATE_OPERATORS,
  'last-modified': DATE_OPERATORS,
  toggle: ['is-true', 'is-false'],
  select: ['is', 'is-not', 'is-empty', 'is-not-empty'],
  collection: ['is-empty', 'is-not-empty'],
};

// The operators available for multiselect select properties
export const MULTISELECT_QUERY_OPERATORS: QueryOperator[] = [
  'contains',
  'not-contains',
  'is-empty',
  'is-not-empty',
];

// Operators that do not take a comparison value
export const VALUE_LESS_QUERY_OPERATORS = new Set<QueryOperator>([
  'is-empty',
  'is-not-empty',
  'is-true',
  'is-false',
]);
