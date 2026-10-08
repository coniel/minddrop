import { Fs } from '@minddrop/file-system';
import { PropertiesSchema } from '@minddrop/properties';

/**
 * Hashes a database's property schema.
 *
 * @param properties - The database's property schema.
 * @returns The schema's hash.
 */
export function hashDatabaseProperties(properties: PropertiesSchema): string {
  return Fs.hashContents(JSON.stringify(properties));
}
