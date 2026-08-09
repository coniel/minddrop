export type QueryTextOperator =
  | 'equals'
  | 'not-equals'
  | 'contains'
  | 'not-contains'
  | 'starts-with'
  | 'ends-with'
  | 'is-empty'
  | 'is-not-empty';

export type QueryNumberOperator =
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'greater-than-or-equal'
  | 'less-than'
  | 'less-than-or-equal'
  | 'is-empty'
  | 'is-not-empty';

export type QueryDateOperator =
  | 'is'
  | 'is-before'
  | 'is-after'
  | 'is-on-or-before'
  | 'is-on-or-after'
  | 'is-empty'
  | 'is-not-empty';

export type QueryToggleOperator = 'is-true' | 'is-false';

export type QuerySelectOperator =
  | 'is'
  | 'is-not'
  | 'contains'
  | 'not-contains'
  | 'is-empty'
  | 'is-not-empty';

export type QueryExistenceOperator = 'is-empty' | 'is-not-empty';

export type QueryOperator =
  | QueryTextOperator
  | QueryNumberOperator
  | QueryDateOperator
  | QueryToggleOperator
  | QuerySelectOperator
  | QueryExistenceOperator;
