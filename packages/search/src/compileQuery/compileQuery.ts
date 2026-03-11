import { QueryPropertyFilter, QueryPropertySort } from '@minddrop/queries';
import { CompiledQuery } from '../types';

// Core entry properties that live directly on the entries table
const CORE_PROPERTIES: Record<string, string> = {
  title: 'e.title',
  created: 'e.created',
  lastModified: 'e.last_modified',
};

/**
 * Compiles query filters and sorts into a parameterized SQL
 * query targeting the search database schema.
 *
 * Core properties (title, created, lastModified) query the
 * entries table directly. Dynamic properties require JOINs
 * to the entry_properties table. Collection properties use
 * subqueries against the entry_property_values table.
 *
 * @param filters - The property filters to apply.
 * @param sorts - The sort order to apply.
 * @param options - Optional database ID scope, limit, and offset.
 * @returns The compiled SQL query and parameters.
 */
export function compileQuery(
  filters: QueryPropertyFilter[],
  sorts: QueryPropertySort[],
  options: {
    databaseId?: string;
    limit?: number;
    offset?: number;
  } = {},
): CompiledQuery {
  const params: (string | number)[] = [];
  const whereClauses: string[] = [];
  const joins: string[] = [];
  let joinIndex = 0;

  // Scope to a specific database if provided
  if (options.databaseId) {
    whereClauses.push('e.database_id = ?');
    params.push(options.databaseId);
  }

  // Build WHERE clauses from filters
  for (const filter of filters) {
    const compiled = compileFilter(filter, joinIndex, params);

    if (compiled.join) {
      joins.push(compiled.join);
      joinIndex++;
    }

    whereClauses.push(compiled.clause);
  }

  // Build ORDER BY
  const orderByParts = sorts.map((sort) => {
    const column = CORE_PROPERTIES[sort.property];

    if (column) {
      return `${column} ${sort.direction === 'ascending' ? 'ASC' : 'DESC'}`;
    }

    // Dynamic property sort requires a join
    const alias = `ps${joinIndex}`;
    joins.push(
      `LEFT JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    );
    params.push(sort.property);
    joinIndex++;

    // Sort by whichever value column is populated
    const direction = sort.direction === 'ascending' ? 'ASC' : 'DESC';

    return `COALESCE(${alias}.value_text, CAST(${alias}.value_number AS TEXT), CAST(${alias}.value_integer AS TEXT)) ${direction}`;
  });

  const orderBy =
    orderByParts.length > 0
      ? `ORDER BY ${orderByParts.join(', ')}`
      : 'ORDER BY e.last_modified DESC';

  const whereStr =
    whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const joinStr = joins.join('\n');

  // Build the count query (no LIMIT/OFFSET/ORDER BY)
  const countSql =
    `SELECT COUNT(*) as total FROM entries e\n${joinStr}\n${whereStr}`.trim();
  const countParams = [...params];

  // Build the main query with pagination
  let sql = `SELECT e.id, e.database_id, e.path, e.title, e.created, e.last_modified FROM entries e\n${joinStr}\n${whereStr}\n${orderBy}`;

  if (options.limit !== undefined) {
    sql += '\nLIMIT ?';
    params.push(options.limit);
  }

  if (options.offset !== undefined) {
    sql += '\nOFFSET ?';
    params.push(options.offset);
  }

  return {
    sql: sql.trim(),
    params,
    countSql,
    countParams,
  };
}

/**
 * Compiles a single filter into a WHERE clause, optionally
 * adding a JOIN to the entry_properties or
 * entry_property_values table.
 */
function compileFilter(
  filter: QueryPropertyFilter,
  joinIndex: number,
  params: (string | number)[],
): { clause: string; join?: string } {
  const coreColumn = CORE_PROPERTIES[filter.property];

  // Core properties filter directly on the entries table
  if (coreColumn) {
    return compileCoreFilter(filter, coreColumn, params);
  }

  // Dynamic properties require a JOIN
  return compileDynamicFilter(filter, joinIndex, params);
}

/**
 * Compiles a filter on a core entry property (title, created,
 * lastModified) into a WHERE clause.
 */
function compileCoreFilter(
  filter: QueryPropertyFilter,
  column: string,
  params: (string | number)[],
): { clause: string } {
  // Basic operators (is-empty, is-not-empty)
  if (filter.operator === 'is-empty') {
    return { clause: `(${column} IS NULL OR ${column} = '')` };
  }

  if (filter.operator === 'is-not-empty') {
    return { clause: `(${column} IS NOT NULL AND ${column} != '')` };
  }

  // String operators
  if (filter.operator === 'equals') {
    params.push(filter.value as string | number);

    return { clause: `${column} = ?` };
  }

  if (filter.operator === 'not-equals') {
    params.push(filter.value as string | number);

    return { clause: `${column} != ?` };
  }

  if (filter.operator === 'contains') {
    params.push(`%${filter.value}%`);

    return { clause: `${column} LIKE ?` };
  }

  if (filter.operator === 'not-contains') {
    params.push(`%${filter.value}%`);

    return { clause: `${column} NOT LIKE ?` };
  }

  // Number/Date operators
  if (filter.operator === 'greater-than') {
    params.push(filter.value as number);

    return { clause: `${column} > ?` };
  }

  if (filter.operator === 'less-than') {
    params.push(filter.value as number);

    return { clause: `${column} < ?` };
  }

  // Date operators
  if (filter.operator === 'before') {
    params.push((filter.value as Date).getTime());

    return { clause: `${column} < ?` };
  }

  if (filter.operator === 'after') {
    params.push((filter.value as Date).getTime());

    return { clause: `${column} > ?` };
  }

  // Boolean operators
  if (filter.operator === 'true') {
    return { clause: `${column} = 1` };
  }

  if (filter.operator === 'false') {
    return { clause: `${column} = 0` };
  }

  return { clause: '1=1' };
}

/**
 * Compiles a filter on a dynamic entry property into a WHERE
 * clause with a JOIN to the entry_properties table.
 */
function compileDynamicFilter(
  filter: QueryPropertyFilter,
  joinIndex: number,
  params: (string | number)[],
): { clause: string; join?: string } {
  const alias = `p${joinIndex}`;

  // Basic operators check for existence of a row in either table
  if (filter.operator === 'is-empty') {
    params.push(filter.property, filter.property);

    return {
      clause: `(NOT EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ?) AND NOT EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ?))`,
    };
  }

  if (filter.operator === 'is-not-empty') {
    params.push(filter.property, filter.property);

    return {
      clause: `(EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ?) OR EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ?))`,
    };
  }

  // String operators check both scalar (entry_properties) and
  // multi-value (entry_property_values) tables since the property
  // could be text, select, collection, etc.
  if (filter.operator === 'equals' && typeof filter.value === 'string') {
    params.push(filter.property, filter.value, filter.property, filter.value);

    return {
      clause: `(EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_text = ?) OR EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text = ?))`,
    };
  }

  if (filter.operator === 'not-equals' && typeof filter.value === 'string') {
    params.push(filter.property, filter.value, filter.property, filter.value);

    return {
      clause: `(NOT EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_text = ?) AND NOT EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text = ?))`,
    };
  }

  if (filter.operator === 'contains') {
    params.push(
      filter.property,
      `%${filter.value}%`,
      filter.property,
      `%${filter.value}%`,
    );

    return {
      clause: `(EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_text LIKE ?) OR EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text LIKE ?))`,
    };
  }

  if (filter.operator === 'not-contains') {
    params.push(
      filter.property,
      `%${filter.value}%`,
      filter.property,
      `%${filter.value}%`,
    );

    return {
      clause: `(NOT EXISTS (SELECT 1 FROM entry_properties WHERE entry_id = e.id AND property_name = ? AND value_text LIKE ?) AND NOT EXISTS (SELECT 1 FROM entry_property_values WHERE entry_id = e.id AND property_name = ? AND value_text LIKE ?))`,
    };
  }

  // Number operators use value_number (scalar table only)
  if (filter.operator === 'equals' && typeof filter.value === 'number') {
    params.push(filter.property, filter.value);

    return {
      clause: `${alias}.value_number = ?`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  if (filter.operator === 'not-equals' && typeof filter.value === 'number') {
    params.push(filter.property, filter.value);

    return {
      clause: `(${alias}.value_number IS NULL OR ${alias}.value_number != ?)`,
      join: `LEFT JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  if (filter.operator === 'greater-than') {
    params.push(filter.property, filter.value as number);

    return {
      clause: `${alias}.value_number > ?`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  if (filter.operator === 'less-than') {
    params.push(filter.property, filter.value as number);

    return {
      clause: `${alias}.value_number < ?`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  // Date operators use value_integer (epoch ms, scalar table only)
  if (filter.operator === 'before') {
    params.push(filter.property, (filter.value as Date).getTime());

    return {
      clause: `${alias}.value_integer < ?`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  if (filter.operator === 'after') {
    params.push(filter.property, (filter.value as Date).getTime());

    return {
      clause: `${alias}.value_integer > ?`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  // Boolean operators use value_integer (0/1, scalar table only)
  if (filter.operator === 'true') {
    params.push(filter.property);

    return {
      clause: `${alias}.value_integer = 1`,
      join: `JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  if (filter.operator === 'false') {
    params.push(filter.property);

    return {
      clause: `(${alias}.value_integer IS NULL OR ${alias}.value_integer = 0)`,
      join: `LEFT JOIN entry_properties ${alias} ON ${alias}.entry_id = e.id AND ${alias}.property_name = ?`,
    };
  }

  return { clause: '1=1' };
}
