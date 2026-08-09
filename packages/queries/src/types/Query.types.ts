import { EntityId } from '@minddrop/utils';
import { QueryOperator } from './QueryOperator.types';

export type QueryId = EntityId<'query'>;

export interface Query {
  /**
   * A unique identifier for the query.
   */
  id: QueryId;

  /**
   * The user defined name of the query.
   */
  name: string;

  /**
   * The ID of the source database the query runs against.
   * An empty string until the user selects a database.
   */
  database: string;

  /**
   * The date the query was created.
   */
  created: Date;

  /**
   * The date the query was last modified.
   */
  lastModified: Date;

  /**
   * The root rule group. Always present, may contain no rules.
   */
  rules: QueryRuleGroup;

  /**
   * The sort order applied to results.
   */
  sort: QuerySort[];
}

export type QueryCombinator = 'and' | 'or';

export interface QueryRuleGroup {
  /**
   * A unique identifier for the group, used as the edit target
   * when modifying the rule tree.
   */
  id: string;

  /**
   * Discriminates groups from rules in the rule tree.
   */
  type: 'group';

  /**
   * How the group's rules are combined.
   */
  combinator: QueryCombinator;

  /**
   * The rules and nested groups making up the group.
   */
  rules: (QueryRule | QueryRuleGroup)[];
}

export interface QueryRule {
  /**
   * A unique identifier for the rule, used as the edit target
   * when modifying the rule tree.
   */
  id: string;

  /**
   * Discriminates rules from groups in the rule tree.
   */
  type: 'rule';

  /**
   * The property name the rule filters by. An empty string
   * until the user picks a property.
   */
  property: string;

  /**
   * The comparison operator. An empty string until the user
   * picks an operator.
   */
  operator: QueryOperator | '';

  /**
   * The comparison value. Undefined until set, and unused by
   * value-less operators.
   */
  value?: QueryRuleValue;
}

export type QueryRuleValue = string | number | QueryDateValue;

export type QueryDateValue =
  | { type: 'absolute'; date: Date }
  | { type: 'relative'; preset: QueryRelativeDatePreset };

export type QueryRelativeDatePreset =
  | 'today'
  | 'yesterday'
  | 'tomorrow'
  | 'one-week-ago'
  | 'one-week-from-now'
  | 'one-month-ago'
  | 'one-month-from-now';

export interface QuerySort {
  /**
   * The property to sort by.
   */
  property: string;

  /**
   * The direction to sort by.
   */
  direction: 'ascending' | 'descending';
}
