import { PropertyFilterValue } from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';
import { QueryNode } from '@minddrop/queries';
import { TagGroups } from '@minddrop/tags';

/**
 * Returns the given nodes fitted to a set of properties. Filter
 * and sort nodes whose property is not among them, matched by
 * name and type, are reset to unconfigured. Select and tags
 * filters on a matched property drop the values the property
 * does not offer, clearing the value when none remain.
 *
 * @param nodes - The query's nodes.
 * @param properties - The properties the nodes can use.
 *
 * @returns The updated nodes.
 */
export function reconcileQueryNodesWithProperties(
  nodes: QueryNode[],
  properties: PropertySchema[],
): QueryNode[] {
  return nodes.map((node) => {
    // Only filter and sort nodes reference a property
    if (node.type !== 'filter' && node.type !== 'sort') {
      return node;
    }

    // Unconfigured nodes have nothing to reconcile
    if (!node.property) {
      return node;
    }

    const property = properties.find(
      (candidate) =>
        candidate.name === node.property &&
        candidate.type === node.propertyType,
    );

    // Reset filters on a missing property
    if (!property && node.type === 'filter') {
      return {
        ...node,
        property: '',
        propertyType: '',
        operator: '',
        value: undefined,
      };
    }

    // Reset sorts on a missing property
    if (!property) {
      return { ...node, property: '', propertyType: '' };
    }

    // Keep the values the property offers
    if (node.type === 'filter') {
      return { ...node, value: pruneValue(node.value, property) };
    }

    return node;
  });
}

/**
 * Drops the parts of a select or tags filter value the property
 * does not offer, returning undefined when none remain. Other
 * values are returned unchanged.
 */
function pruneValue(
  value: PropertyFilterValue | undefined,
  property: PropertySchema,
): PropertyFilterValue | undefined {
  const offered = resolveOfferedValues(property);

  // Unrestricted values are always valid
  if (!offered) {
    return value;
  }

  if (Array.isArray(value)) {
    const kept = value.filter((item) => offered.includes(item));

    return kept.length ? kept : undefined;
  }

  if (typeof value === 'string') {
    return offered.includes(value) ? value : undefined;
  }

  return value;
}

/**
 * Returns the values a select or tags property offers, or null
 * when its values are unrestricted.
 */
function resolveOfferedValues(property: PropertySchema): string[] | null {
  // Select filters compare option values
  if (property.type === 'select') {
    return property.options.map((option) => option.value);
  }

  // Tags filters compare tag names, limited to the property's
  // group when one is set.
  if (property.type === 'tags' && property.group) {
    return TagGroups.getTags(property.group).map((tag) => tag.name);
  }

  return null;
}
