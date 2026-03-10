export interface Query {
  /**
   * A unique identifier for the query.
   */
  id: string;

  /**
   * The user defined name of the query.
   */
  name: string;

  /**
   * The date the query was created.
   */
  created: Date;

  /**
   * The date the query was last modified.
   */
  lastModified: Date;

  /**
   * The filters to apply to the query.
   */
  filters: QueryPropertyFilter[];

  /**
   * The sort order to apply to the query.
   */
  sort: QueryPropertySort[];
}

export interface QueryPropertySort {
  /**
   * The property to sort by.
   */
  property: string;

  /**
   * The direction to sort by.
   */
  direction: 'ascending' | 'descending';
}

export interface QueryBasicPropertyFilter {
  /**
   * The property to filter by.
   */
  property: string;

  /**
   * The operator to use when filtering.
   */
  operator: 'is-empty' | 'is-not-empty';
}

export interface QueryStringPropertyFilter {
  /**
   * The property to filter by.
   */
  property: string;

  /**
   * The value to filter by.
   */
  value: string;

  /**
   * The operator to use when filtering.
   */
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains';
}

export interface QueryNumberPropertyFilter {
  /**
   * The property to filter by.
   */
  property: string;

  /**
   * The value to filter by.
   */
  value: number;

  /**
   * The operator to use when filtering.
   */
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than';
}

export interface QueryDatePropertyFilter {
  /**
   * The property to filter by.
   */
  property: string;

  /**
   * The value to filter by.
   */
  value: Date;

  /**
   * The operator to use when filtering.
   */
  operator: 'equals' | 'not-equals' | 'before' | 'after';
}

export interface QueryBooleanPropertyFilter {
  /**
   * The property to filter by.
   */
  property: string;

  /**
   * The value to filter by.
   */
  value: boolean;

  /**
   * The operator to use when filtering.
   */
  operator: 'true' | 'false';
}

export type QueryPropertyFilter =
  | QueryBasicPropertyFilter
  | QueryStringPropertyFilter
  | QueryNumberPropertyFilter
  | QueryDatePropertyFilter
  | QueryBooleanPropertyFilter;
