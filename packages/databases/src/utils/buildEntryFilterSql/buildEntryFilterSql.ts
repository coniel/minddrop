import { SqlParam } from '@minddrop/sql';
import { MULTI_VALUE_PROPERTY_TYPES } from '../../constants';
import {
  EntryFilter,
  EntryFilterGroup,
  EntryMultiValueFilter,
  EntryNumberFilter,
  EntryTextFilter,
} from '../../types';
import { escapeLikePattern } from '../escapeLikePattern';

export interface EntryFilterSql {
  /**
   * The WHERE clause fragment. References the entries table
   * via the `e` alias.
   */
  sql: string;

  /**
   * The positional parameters bound by the fragment, in order.
   */
  params: SqlParam[];
}

/**
 * Builds a parameterized WHERE clause fragment from an entry
 * filter group. The fragment references the entries table via
 * the `e` alias and compares property values through EXISTS
 * subqueries against the entry property tables.
 *
 * Negative operators compile to NOT EXISTS, so entries lacking
 * the property match them.
 *
 * @param group - The filter group to build SQL for.
 *
 * @returns The SQL fragment and its parameters, or null if the group tree contains no filters.
 */
export function buildEntryFilterSql(
  group: EntryFilterGroup,
): EntryFilterSql | null {
  const fragments: string[] = [];
  const params: SqlParam[] = [];

  // Build each child fragment, recursing into nested groups
  for (const node of group.filters) {
    if (isFilterGroup(node)) {
      const nested = buildEntryFilterSql(node);

      // Skip nested groups that contain no filters
      if (!nested) {
        continue;
      }

      fragments.push(nested.sql);
      params.push(...nested.params);

      continue;
    }

    const filter = buildFilterSql(node);

    fragments.push(filter.sql);
    params.push(...filter.params);
  }

  // A group with no filters produces no SQL
  if (fragments.length === 0) {
    return null;
  }

  // Join the fragments with the group's combinator and
  // parenthesize to preserve precedence when nested
  const joiner = group.combinator === 'and' ? ' AND ' : ' OR ';

  return { sql: `(${fragments.join(joiner)})`, params };
}

/**
 * Checks whether a filter tree node is a nested group.
 */
function isFilterGroup(
  node: EntryFilter | EntryFilterGroup,
): node is EntryFilterGroup {
  return 'combinator' in node;
}

/**
 * Builds the SQL fragment for a single filter, routing to the
 * entries table columns or the entry property tables based on
 * the property type.
 */
function buildFilterSql(filter: EntryFilter): EntryFilterSql {
  // Title/created/last-modified live as columns on the entries
  // table, compare them directly
  const pseudoColumn = getPseudoPropertyColumn(filter.propertyType);

  if (pseudoColumn) {
    return buildPseudoPropertySql(pseudoColumn, filter);
  }

  switch (filter.operator) {
    // Existence tests check for the presence of any property row
    case 'is-empty':
    case 'is-not-empty':
      return buildExistenceSql(filter);

    // Membership tests run against the multi-value table
    case 'has-value':
    case 'not-has-value':
      return buildMultiValueSql(filter);

    // Text comparisons run against the scalar value_text column
    case 'text-equals':
    case 'text-not-equals':
    case 'text-contains':
    case 'text-not-contains':
    case 'text-starts-with':
    case 'text-ends-with':
      return buildScalarTextSql(filter);

    // Remaining operators are numeric comparisons
    default:
      return buildScalarNumberSql(filter);
  }
}

/**
 * Returns the entries table column for the title, created and
 * last-modified pseudo-properties, or null for regular
 * properties.
 */
function getPseudoPropertyColumn(propertyType: string): string | null {
  if (propertyType === 'title') {
    return 'e.title';
  }

  if (propertyType === 'created') {
    return 'e.created';
  }

  if (propertyType === 'last-modified') {
    return 'e.last_modified';
  }

  return null;
}

/**
 * Builds a direct column comparison for a pseudo-property
 * filter.
 */
function buildPseudoPropertySql(
  column: string,
  filter: EntryFilter,
): EntryFilterSql {
  switch (filter.operator) {
    // Text comparisons on the title column
    case 'text-equals':
      return { sql: `${column} = ? COLLATE NOCASE`, params: [filter.value] };
    case 'text-not-equals':
      return { sql: `${column} <> ? COLLATE NOCASE`, params: [filter.value] };
    case 'text-contains':
      return likeComparison(
        column,
        'LIKE',
        `%${escapeLikePattern(filter.value)}%`,
      );
    case 'text-not-contains':
      return likeComparison(
        column,
        'NOT LIKE',
        `%${escapeLikePattern(filter.value)}%`,
      );
    case 'text-starts-with':
      return likeComparison(
        column,
        'LIKE',
        `${escapeLikePattern(filter.value)}%`,
      );
    case 'text-ends-with':
      return likeComparison(
        column,
        'LIKE',
        `%${escapeLikePattern(filter.value)}`,
      );

    // Numeric comparisons on the created/last_modified columns
    case 'number-equals':
      return { sql: `${column} = ?`, params: [filter.value] };
    case 'number-not-equals':
      return { sql: `${column} <> ?`, params: [filter.value] };
    case 'number-less-than':
      return { sql: `${column} < ?`, params: [filter.value] };
    case 'number-less-than-or-equal':
      return { sql: `${column} <= ?`, params: [filter.value] };
    case 'number-greater-than':
      return { sql: `${column} > ?`, params: [filter.value] };
    case 'number-greater-than-or-equal':
      return { sql: `${column} >= ?`, params: [filter.value] };

    // Pseudo-property columns are NOT NULL, existence tests
    // resolve to constant clauses
    case 'is-empty':
      return { sql: `${column} IS NULL`, params: [] };
    case 'is-not-empty':
      return { sql: `${column} IS NOT NULL`, params: [] };

    // Membership operators do not apply to pseudo-properties,
    // match nothing
    default:
      return { sql: '0', params: [] };
  }
}

/**
 * Builds a LIKE comparison fragment with wildcard escaping.
 */
function likeComparison(
  column: string,
  keyword: string,
  pattern: string,
): EntryFilterSql {
  return { sql: `${column} ${keyword} ? ESCAPE '\\'`, params: [pattern] };
}

/**
 * Builds an existence test checking whether any row exists for
 * the property, routed to the table matching the property type.
 */
function buildExistenceSql(filter: EntryFilter): EntryFilterSql {
  // Multi-value properties store their values in the
  // entry_property_values table
  const table = MULTI_VALUE_PROPERTY_TYPES.has(filter.propertyType)
    ? 'entry_property_values'
    : 'entry_properties';

  const subquery = `SELECT 1 FROM ${table} WHERE entry_id = e.id AND property_name = ?`;

  if (filter.operator === 'is-empty') {
    return { sql: `NOT EXISTS (${subquery})`, params: [filter.property] };
  }

  return { sql: `EXISTS (${subquery})`, params: [filter.property] };
}

/**
 * Builds a membership test against the multi-value table.
 */
function buildMultiValueSql(filter: EntryMultiValueFilter): EntryFilterSql {
  const subquery = `SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text = ?`;
  const params: SqlParam[] = [filter.property, filter.value];

  // Negative membership compiles to NOT EXISTS so entries
  // without the property match
  if (filter.operator === 'not-has-value') {
    return { sql: `NOT EXISTS (${subquery})`, params };
  }

  return { sql: `EXISTS (${subquery})`, params };
}

/**
 * Builds a text comparison against the scalar value_text
 * column via an EXISTS subquery.
 */
function buildScalarTextSql(filter: EntryTextFilter): EntryFilterSql {
  const subqueryPrefix = `SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ?`;

  switch (filter.operator) {
    case 'text-equals':
      return {
        sql: `EXISTS (${subqueryPrefix} AND value_text = ? COLLATE NOCASE)`,
        params: [filter.property, filter.value],
      };

    // Negative equality compiles to NOT EXISTS so entries
    // without the property match
    case 'text-not-equals':
      return {
        sql: `NOT EXISTS (${subqueryPrefix} AND value_text = ? COLLATE NOCASE)`,
        params: [filter.property, filter.value],
      };
    case 'text-contains':
      return {
        sql: `EXISTS (${subqueryPrefix} AND value_text LIKE ? ESCAPE '\\')`,
        params: [filter.property, `%${escapeLikePattern(filter.value)}%`],
      };

    // Negative containment compiles to NOT EXISTS so entries
    // without the property match
    case 'text-not-contains':
      return {
        sql: `NOT EXISTS (${subqueryPrefix} AND value_text LIKE ? ESCAPE '\\')`,
        params: [filter.property, `%${escapeLikePattern(filter.value)}%`],
      };
    case 'text-starts-with':
      return {
        sql: `EXISTS (${subqueryPrefix} AND value_text LIKE ? ESCAPE '\\')`,
        params: [filter.property, `${escapeLikePattern(filter.value)}%`],
      };
    default:
      return {
        sql: `EXISTS (${subqueryPrefix} AND value_text LIKE ? ESCAPE '\\')`,
        params: [filter.property, `%${escapeLikePattern(filter.value)}`],
      };
  }
}

/**
 * Builds a numeric comparison against the scalar value column
 * matching the property type via an EXISTS subquery.
 */
function buildScalarNumberSql(filter: EntryNumberFilter): EntryFilterSql {
  // Number properties store REAL values, integer-backed types
  // (toggle, date, created, last-modified) store integers
  const column =
    filter.propertyType === 'number' ? 'value_number' : 'value_integer';

  const subqueryPrefix = `SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ?`;
  const params: SqlParam[] = [filter.property, filter.value];

  // Negative equality compiles to NOT EXISTS so entries
  // without the property match
  if (filter.operator === 'number-not-equals') {
    return {
      sql: `NOT EXISTS (${subqueryPrefix} AND ${column} = ?)`,
      params,
    };
  }

  const comparison = numberComparisonOperator(filter.operator);

  return {
    sql: `EXISTS (${subqueryPrefix} AND ${column} ${comparison} ?)`,
    params,
  };
}

/**
 * Maps a numeric filter operator to its SQL comparison
 * operator.
 */
function numberComparisonOperator(
  operator: EntryNumberFilter['operator'],
): string {
  if (operator === 'number-less-than') {
    return '<';
  }

  if (operator === 'number-less-than-or-equal') {
    return '<=';
  }

  if (operator === 'number-greater-than') {
    return '>';
  }

  if (operator === 'number-greater-than-or-equal') {
    return '>=';
  }

  return '=';
}
