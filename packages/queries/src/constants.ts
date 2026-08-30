import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import type { QueryOperator } from './types';

export const QueriesDirName = 'queries';
export const QueryFileExtension = 'json';

/**
 * The icon used to represent queries in the UI.
 */
export const QueriesIcon: UiIconName = 'list-filter';

/**
 * The default icon assigned to newly created queries.
 */
export const DefaultQueryIcon = 'content-icon:list-filter:default';

// Where a new query's unconfigured source node is seeded on the
// canvas
export const DEFAULT_SOURCE_NODE_POSITION = { x: 0, y: 120 };

// Where a new query's results node is seeded, leaving a gap
// after the source node wide enough to drop a filter node into
export const DEFAULT_RESULTS_NODE_POSITION = { x: 640, y: 120 };

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

// The operators available for multiselect select properties
export const MULTISELECT_QUERY_OPERATORS: QueryOperator[] = [
  'contains',
  'not-contains',
  'is-empty',
  'is-not-empty',
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
  // Tags are always multi-value, membership tests only
  tags: MULTISELECT_QUERY_OPERATORS,
  // Color values live in entry metadata, which is not SQL
  // indexed, so color cannot be filtered on yet
  color: [],
  // Collections test membership of the picked entries
  collection: [
    'contains-any',
    'contains-all',
    'contains-none',
    'is-empty',
    'is-not-empty',
  ],
};

// Operators that do not take a comparison value
export const VALUE_LESS_QUERY_OPERATORS = new Set<QueryOperator>([
  'is-empty',
  'is-not-empty',
  'is-true',
  'is-false',
]);
