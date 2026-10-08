import { SqlEntryRecord } from '../types';

/**
 * Returns the value of the named property on an entry record.
 *
 * @param record - The entry record.
 * @param name - The name of the property.
 * @returns The property's value, or undefined if the record has no such property.
 */
export function propertyValue(record: SqlEntryRecord, name: string) {
  return record.properties.find((property) => property.name === name)?.value;
}
