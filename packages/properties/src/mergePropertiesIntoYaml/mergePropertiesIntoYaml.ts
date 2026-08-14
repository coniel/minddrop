import { YAML } from '@minddrop/utils';
import { parsePropertiesFromYaml } from '../parsePropertiesFromYaml';
import { PropertiesSchema, PropertyMap } from '../types';
import { isEqualPropertyValue } from '../utils';

/**
 * Merges the given properties into existing YAML, editing it in place so that
 * anything the properties system does not model survives: comments, key order,
 * quoting style, block scalars and keys absent from the schema.
 *
 * Only keys whose value actually changed are written. A key which the schema
 * declares but the properties omit is treated as cleared and removed, while a
 * key absent from the schema is left untouched.
 *
 * @param schema - The properties schema.
 * @param properties - The properties to merge in.
 * @param yaml - The existing YAML to merge into.
 * @returns The merged YAML.
 */
export function mergePropertiesIntoYaml(
  schema: PropertiesSchema,
  properties: PropertyMap,
  yaml: string,
): string {
  const document = YAML.parseDocument(yaml);
  // Parse the existing YAML back into properties so values are compared in
  // the same shape, with date strings already revived into Date objects
  const existingProperties = parsePropertiesFromYaml(schema, yaml);

  // Remove schema keys which the properties no longer carry, which is how a
  // cleared property reaches the file. Keys the schema does not declare are
  // left alone, since MindDrop does not model them and must not destroy them.
  schema.forEach((property) => {
    if (property.name in existingProperties && !(property.name in properties)) {
      document.delete(property.name);
    }
  });

  // Write only the values which actually changed, leaving the formatting of
  // every untouched key exactly as the author wrote it
  Object.entries(properties).forEach(([name, value]) => {
    if (isEqualPropertyValue(existingProperties[name], value)) {
      return;
    }

    document.set(name, value);
  });

  orderSchemaKeys(document, schema);

  return String(document);
}

/**
 * Reorders the document's schema keys to match the order of the schema, which
 * is what the database's property sorting controls. Keys absent from the schema
 * hold their position, since their placement is the author's rather than the
 * database's.
 *
 * @param document - The YAML document to reorder, modified in place.
 * @param schema - The properties schema.
 */
function orderSchemaKeys(
  document: ReturnType<typeof YAML.parseDocument>,
  schema: PropertiesSchema,
): void {
  const contents = document.contents;

  // A document with no mapping has nothing to order
  if (!YAML.isMap(contents)) {
    return;
  }

  const schemaOrder = schema.map((property) => property.name);
  const isSchemaKey = (item: { key: unknown }) =>
    schemaOrder.includes(keyName(item));

  // The schema keys the document holds, in the order the schema declares them
  const orderedSchemaItems = contents.items
    .filter(isSchemaKey)
    .sort(
      (a, b) =>
        schemaOrder.indexOf(keyName(a)) - schemaOrder.indexOf(keyName(b)),
    );

  // Walk the existing slots, leaving non-schema keys where the author put them
  // and filling every other slot from the schema ordered list
  let nextSchemaItem = 0;

  contents.items = contents.items.map((item) =>
    isSchemaKey(item) ? orderedSchemaItems[nextSchemaItem++] : item,
  );
}

/**
 * Returns a document item's key as a string. Keys parsed from the source are
 * Scalar nodes, while keys added through `set` are plain strings.
 *
 * @param item - The document item.
 * @returns The item's key.
 */
function keyName(item: { key: unknown }): string {
  const key = item.key;

  if (typeof key === 'string') {
    return key;
  }

  return String((key as { value: unknown })?.value);
}
