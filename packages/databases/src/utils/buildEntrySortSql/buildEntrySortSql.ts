import { SqlParam } from '@minddrop/sql';
import {
  MULTI_VALUE_PROPERTY_TYPES,
  TEXT_PROPERTY_TYPES,
} from '../../constants';
import { EntrySort } from '../../types';

export interface EntrySortSql {
  /**
   * LEFT JOIN clauses for the sorted properties, empty when no
   * property joins are needed.
   */
  joins: string;

  /**
   * The ORDER BY term list, without the ORDER BY keyword.
   */
  orderBy: string;

  /**
   * The positional parameters bound by the join clauses, in
   * order.
   */
  params: SqlParam[];
}

/**
 * Builds the JOIN and ORDER BY clauses for a list of entry sort
 * instructions. Property sorts join the entry_properties table
 * once per property and order entries missing the property
 * last. Sorts on multi-value properties are dropped.
 *
 * The entries title is always appended as the final tiebreaker,
 * making it the default order when no sorts are given.
 *
 * @param sort - The sort instructions to build SQL for.
 *
 * @returns The join clauses, ORDER BY terms and join parameters.
 */
export function buildEntrySortSql(sort: EntrySort[]): EntrySortSql {
  const joins: string[] = [];
  const terms: string[] = [];
  const params: SqlParam[] = [];

  for (const entry of sort) {
    const direction = entry.direction === 'descending' ? 'DESC' : 'ASC';

    // Multi-value properties have no single sortable value
    if (MULTI_VALUE_PROPERTY_TYPES.has(entry.propertyType)) {
      continue;
    }

    // Title/created/last-modified sort on the entries table
    // columns directly
    if (entry.propertyType === 'title') {
      terms.push(`e.title COLLATE NOCASE ${direction}`);

      continue;
    }

    if (entry.propertyType === 'created') {
      terms.push(`e.created ${direction}`);

      continue;
    }

    if (entry.propertyType === 'last-modified') {
      terms.push(`e.last_modified ${direction}`);

      continue;
    }

    // Scalar properties join their entry_properties row, one
    // aliased join per sort entry
    const alias = `sort_${joins.length}`;

    joins.push(
      `LEFT JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    );
    params.push(entry.property);

    // Entries missing the property sort last regardless of
    // direction
    terms.push(`(${alias}.entry_id IS NULL) ASC`);

    // Order by the value column matching the property type
    terms.push(`${sortValueColumn(alias, entry)} ${direction}`);
  }

  // Always break ties by title so result order is stable
  terms.push('e.title COLLATE NOCASE ASC');

  return { joins: joins.join(' '), orderBy: terms.join(', '), params };
}

/**
 * Returns the aliased value column expression to order by for
 * a scalar property sort.
 */
function sortValueColumn(alias: string, entry: EntrySort): string {
  // Text values sort case-insensitively
  if (TEXT_PROPERTY_TYPES.has(entry.propertyType)) {
    return `${alias}.value_text COLLATE NOCASE`;
  }

  // Number properties store REAL values
  if (entry.propertyType === 'number') {
    return `${alias}.value_number`;
  }

  // Integer-backed types (toggle, date) store integers
  return `${alias}.value_integer`;
}
