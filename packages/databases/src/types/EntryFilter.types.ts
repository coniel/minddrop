import { PropertyType } from '@minddrop/properties';

export type EntryFilterCombinator = 'and' | 'or';

/**
 * A nestable group of entry filters combined with AND or OR.
 */
export interface EntryFilterGroup {
  /**
   * How the group's filters are combined.
   */
  combinator: EntryFilterCombinator;

  /**
   * The filters and nested groups making up the group.
   */
  filters: (EntryFilter | EntryFilterGroup)[];
}

interface EntryFilterBase {
  /**
   * The property name from the database schema, including the
   * title/created/last-modified pseudo-properties.
   */
  property: string;

  /**
   * The property type, used to route the comparison to the
   * correct SQL table and value column.
   */
  propertyType: PropertyType;
}

/**
 * A text comparison against a property's text value.
 */
export interface EntryTextFilter extends EntryFilterBase {
  operator:
    | 'text-equals'
    | 'text-not-equals'
    | 'text-contains'
    | 'text-not-contains'
    | 'text-starts-with'
    | 'text-ends-with';
  value: string;
}

/**
 * A numeric comparison against a property's number/integer value.
 * Booleans are represented as 1/0 and dates as epoch milliseconds.
 */
export interface EntryNumberFilter extends EntryFilterBase {
  operator:
    | 'number-equals'
    | 'number-not-equals'
    | 'number-less-than'
    | 'number-less-than-or-equal'
    | 'number-greater-than'
    | 'number-greater-than-or-equal';
  value: number;
}

/**
 * A membership test against a multi-value property's values.
 */
export interface EntryMultiValueFilter extends EntryFilterBase {
  operator: 'has-value' | 'not-has-value';
  value: string;
}

/**
 * An existence test checking whether a property has any value.
 */
export interface EntryExistenceFilter extends EntryFilterBase {
  operator: 'is-empty' | 'is-not-empty';
}

export type EntryFilter =
  | EntryTextFilter
  | EntryNumberFilter
  | EntryMultiValueFilter
  | EntryExistenceFilter;

/**
 * A sort instruction for SQL entry queries.
 */
export interface EntrySort {
  /**
   * The property name to sort by, including the
   * title/created/last-modified pseudo-properties.
   */
  property: string;

  /**
   * The property type, used to route the sort to the correct
   * SQL column.
   */
  propertyType: PropertyType;

  /**
   * The sort direction.
   */
  direction: 'ascending' | 'descending';
}
