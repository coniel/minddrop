import { PropertyChange } from '@minddrop/history';
import { PropertiesSchema, PropertyMap } from '@minddrop/properties';

// The property types whose values follow from the change being made
// rather than describing it.
const TimestampPropertyTypes = ['created', 'last-modified'];

/**
 * Works out which of an entry's properties changed, in the form its
 * history records them.
 *
 * @param schema - The database's properties schema.
 * @param original - The entry's property values before the change.
 * @param updated - The entry's property values after the change.
 * @returns The properties whose values differ.
 */
export function resolvePropertyChanges(
  schema: PropertiesSchema,
  original: PropertyMap,
  updated: PropertyMap,
): PropertyChange[] {
  // Take the names from both sides, so a property added or removed by
  // the change is covered as well as one whose value moved.
  const names = new Set([...Object.keys(original), ...Object.keys(updated)]);

  // Drop the timestamp properties. Created is its own record, and last
  // modified follows from every record's own timestamp.
  const recorded = [...names].filter((name) => !isTimestamp(schema, name));

  // Compare each property's value either side of the change
  const changes = recorded.map((name) => ({
    property: name,
    from: original[name] ?? null,
    to: updated[name] ?? null,
  }));

  // Keep only the properties which actually moved
  return changes.filter((change) => !isEqual(change.from, change.to));
}

/**
 * Checks whether a property is one of the timestamp types.
 */
function isTimestamp(schema: PropertiesSchema, name: string): boolean {
  const property = schema.find((property) => property.name === name);

  return !!property && TimestampPropertyTypes.includes(property.type);
}

/**
 * Compares two property values, which may be dates or lists.
 */
function isEqual(from: unknown, to: unknown): boolean {
  // Dates compare by their time rather than by identity
  if (from instanceof Date && to instanceof Date) {
    return from.getTime() === to.getTime();
  }

  // Lists compare by their members in order
  if (Array.isArray(from) && Array.isArray(to)) {
    return (
      from.length === to.length &&
      from.every((member, index) => member === to[index])
    );
  }

  return from === to;
}
