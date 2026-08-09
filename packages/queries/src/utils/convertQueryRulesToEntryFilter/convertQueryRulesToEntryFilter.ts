import {
  Database,
  EntryFilter,
  EntryFilterGroup,
  withImplicitTitleProperty,
} from '@minddrop/databases';
import { PropertySchema } from '@minddrop/properties';
import {
  QueryDateValue,
  QueryRule,
  QueryRuleGroup,
  QueryRuleValue,
} from '../../types';
import { isCompleteQueryRule } from '../isCompleteQueryRule';
import { resolveQueryDateRange } from '../resolveQueryDateRange';

/**
 * Converts a query rule group into a SQL entry filter group,
 * resolving property types against the database schema and
 * relative date values into absolute ranges.
 *
 * Incomplete rules, rules referencing properties missing from
 * the schema, and rules whose value does not match the property
 * type are excluded.
 *
 * @param rules - The rule group to convert.
 * @param database - The database the query runs against.
 *
 * @returns The entry filter group.
 */
export function convertQueryRulesToEntryFilter(
  rules: QueryRuleGroup,
  database: Database,
): EntryFilterGroup {
  // Resolve rule properties against the schema including the
  // implicit title property
  const schema = withImplicitTitleProperty(database.properties);

  const filters: (EntryFilter | EntryFilterGroup)[] = [];

  for (const node of rules.rules) {
    // Recurse into nested groups
    if (node.type === 'group') {
      filters.push(convertQueryRulesToEntryFilter(node, database));

      continue;
    }

    // Skip rules that are not fully configured
    if (!isCompleteQueryRule(node)) {
      continue;
    }

    // Skip rules referencing properties missing from the schema
    const property = schema.find(
      (propertySchema) => propertySchema.name === node.property,
    );

    if (!property) {
      continue;
    }

    const filter = convertRule(node, property);

    // Skip rules whose value does not match the property type
    if (!filter) {
      continue;
    }

    filters.push(filter);
  }

  return { combinator: rules.combinator, filters };
}

/**
 * Converts a single rule into an entry filter, routed by the
 * property type. Returns null when the rule's operator or
 * value does not fit the property type.
 */
function convertRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | EntryFilterGroup | null {
  // Existence operators apply to all property types
  if (rule.operator === 'is-empty' || rule.operator === 'is-not-empty') {
    return {
      property: property.name,
      propertyType: property.type,
      operator: rule.operator,
    };
  }

  // Toggle checks compile to integer comparisons, is-false
  // matches unset toggles via the negative operator
  if (property.type === 'toggle') {
    return convertToggleRule(rule, property);
  }

  // Date-like rules expand relative and absolute values to
  // day ranges
  if (
    property.type === 'date' ||
    property.type === 'created' ||
    property.type === 'last-modified'
  ) {
    return convertDateRule(rule, property);
  }

  // Multi-value properties compare via membership tests
  if (property.type === 'select' || property.type === 'collection') {
    return convertSelectRule(rule, property);
  }

  if (property.type === 'number') {
    return convertNumberRule(rule, property);
  }

  return convertTextRule(rule, property);
}

/**
 * Converts a toggle rule into an integer comparison filter.
 */
function convertToggleRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | null {
  if (rule.operator === 'is-true') {
    return {
      property: property.name,
      propertyType: property.type,
      operator: 'number-equals',
      value: 1,
    };
  }

  if (rule.operator === 'is-false') {
    return {
      property: property.name,
      propertyType: property.type,
      operator: 'number-not-equals',
      value: 1,
    };
  }

  return null;
}

/**
 * Converts a date rule into epoch millisecond range filters
 * covering the rule's local day.
 */
function convertDateRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | EntryFilterGroup | null {
  // The value must be a date value object
  if (!isQueryDateValue(rule.value)) {
    return null;
  }

  const { start, end } = resolveQueryDateRange(rule.value);
  const base = { property: property.name, propertyType: property.type };

  switch (rule.operator) {
    // Within the day range
    case 'is':
      return {
        combinator: 'and',
        filters: [
          { ...base, operator: 'number-greater-than-or-equal', value: start },
          { ...base, operator: 'number-less-than', value: end },
        ],
      };
    case 'is-before':
      return { ...base, operator: 'number-less-than', value: start };
    case 'is-after':
      return { ...base, operator: 'number-greater-than-or-equal', value: end };
    case 'is-on-or-before':
      return { ...base, operator: 'number-less-than', value: end };
    case 'is-on-or-after':
      return {
        ...base,
        operator: 'number-greater-than-or-equal',
        value: start,
      };
    default:
      return null;
  }
}

/**
 * Converts a select/collection rule into a membership filter.
 */
function convertSelectRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | null {
  if (typeof rule.value !== 'string') {
    return null;
  }

  const base = { property: property.name, propertyType: property.type };

  if (rule.operator === 'is' || rule.operator === 'contains') {
    return { ...base, operator: 'has-value', value: rule.value };
  }

  if (rule.operator === 'is-not' || rule.operator === 'not-contains') {
    return { ...base, operator: 'not-has-value', value: rule.value };
  }

  return null;
}

/**
 * Converts a number rule into a numeric comparison filter.
 */
function convertNumberRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | null {
  if (typeof rule.value !== 'number') {
    return null;
  }

  const base = { property: property.name, propertyType: property.type };

  switch (rule.operator) {
    case 'equals':
      return { ...base, operator: 'number-equals', value: rule.value };
    case 'not-equals':
      return { ...base, operator: 'number-not-equals', value: rule.value };
    case 'greater-than':
      return { ...base, operator: 'number-greater-than', value: rule.value };
    case 'greater-than-or-equal':
      return {
        ...base,
        operator: 'number-greater-than-or-equal',
        value: rule.value,
      };
    case 'less-than':
      return { ...base, operator: 'number-less-than', value: rule.value };
    case 'less-than-or-equal':
      return {
        ...base,
        operator: 'number-less-than-or-equal',
        value: rule.value,
      };
    default:
      return null;
  }
}

/**
 * Converts a text rule into a text comparison filter.
 */
function convertTextRule(
  rule: QueryRule,
  property: PropertySchema,
): EntryFilter | null {
  if (typeof rule.value !== 'string') {
    return null;
  }

  const base = { property: property.name, propertyType: property.type };

  switch (rule.operator) {
    case 'equals':
      return { ...base, operator: 'text-equals', value: rule.value };
    case 'not-equals':
      return { ...base, operator: 'text-not-equals', value: rule.value };
    case 'contains':
      return { ...base, operator: 'text-contains', value: rule.value };
    case 'not-contains':
      return { ...base, operator: 'text-not-contains', value: rule.value };
    case 'starts-with':
      return { ...base, operator: 'text-starts-with', value: rule.value };
    case 'ends-with':
      return { ...base, operator: 'text-ends-with', value: rule.value };
    default:
      return null;
  }
}

/**
 * Checks whether a rule value is a date value object.
 */
function isQueryDateValue(
  value: QueryRuleValue | undefined,
): value is QueryDateValue {
  return typeof value === 'object' && value !== null;
}
