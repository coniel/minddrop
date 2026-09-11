import { PropertyType } from './Properties.types';

export type PropertyFilterTextOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'is-empty'
  | 'is-not-empty';

export type PropertyFilterNumberOperator =
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'greater-than-or-equal'
  | 'less-than'
  | 'less-than-or-equal'
  | 'is-empty'
  | 'is-not-empty';

export type PropertyFilterDateOperator =
  | 'is'
  | 'is-before'
  | 'is-after'
  | 'is-on-or-before'
  | 'is-on-or-after'
  | 'is-empty'
  | 'is-not-empty';

export type PropertyFilterToggleOperator = 'is-true' | 'is-false';

export type PropertyFilterSelectOperator =
  | 'is'
  | 'is-not'
  | 'contains'
  | 'not-contains'
  | 'is-empty'
  | 'is-not-empty';

export type PropertyFilterCollectionOperator =
  | 'contains-any'
  | 'contains-all'
  | 'contains-none'
  | 'is-empty'
  | 'is-not-empty';

export type PropertyFilterExistenceOperator = 'is-empty' | 'is-not-empty';

export type PropertyFilterOperator =
  | PropertyFilterTextOperator
  | PropertyFilterNumberOperator
  | PropertyFilterDateOperator
  | PropertyFilterToggleOperator
  | PropertyFilterSelectOperator
  | PropertyFilterCollectionOperator
  | PropertyFilterExistenceOperator;

export type PropertyFilterValue =
  | string
  | number
  | string[]
  | PropertyFilterDateValue;

export type PropertyFilterDateValue =
  | { type: 'absolute'; date: Date }
  | { type: 'relative'; preset: PropertyFilterRelativeDatePreset }
  | {
      type: 'relative-range';
      days: number;
      direction: PropertyFilterRelativeRangeDirection;
    };

export type PropertyFilterRelativeRangeDirection = 'past' | 'next';

export type PropertyFilterRelativeDatePreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'one-week-ago'
  | 'one-week-from-now'
  | 'one-month-ago'
  | 'one-month-from-now';

/**
 * A single check against one property: the property, how it is
 * compared, and what it is compared to.
 */
export interface PropertyFilter {
  /**
   * The name of the filtered property. Metadata properties are
   * identified by their type instead, since their names are
   * translated.
   */
  property: string;

  /**
   * The filtered property's type, which decides how the
   * comparison runs and where the value comes from.
   */
  propertyType: PropertyType;

  /**
   * The comparison operator.
   */
  operator: PropertyFilterOperator;

  /**
   * The comparison value. Unused by value-less operators.
   */
  value?: PropertyFilterValue;
}

/**
 * A property filter being configured. Empty strings stand in for
 * the property type and operator until the user picks them.
 */
export interface PropertyFilterDraft {
  /**
   * The name of the filtered property. An empty string until the
   * user picks a property.
   */
  property: string;

  /**
   * The picked property's type. An empty string until the user
   * picks a property.
   */
  propertyType: PropertyType | '';

  /**
   * The comparison operator. An empty string until the user
   * picks an operator.
   */
  operator: PropertyFilterOperator | '';

  /**
   * The comparison value. Undefined until set, and unused by
   * value-less operators.
   */
  value?: PropertyFilterValue;
}
