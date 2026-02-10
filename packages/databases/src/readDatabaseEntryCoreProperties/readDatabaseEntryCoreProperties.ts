import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import { Database, DatabaseEntryCoreProperties } from '../types';
import { entryCorePropertiesFilePath } from '../utils';

/**
 * Reads an entry's core properties from the file system.
 * If the core properties file is missing, a new one is created.
 *
 * @param path - The entry path.
 * @param database - The database the entry belongs to.
 *
 * @returns The entry's core properties.
 */
export async function readDatabaseEntryCoreProperties(
  path: string,
  database: Database,
): Promise<DatabaseEntryCoreProperties> {
  try {
    // Read the entry's core properties
    const fileContents = await Fs.readTextFile(
      entryCorePropertiesFilePath(path),
    );

    return Properties.fromYaml<DatabaseEntryCoreProperties>(
      database.properties,
      fileContents,
    );
  } catch (error) {
    // If the core properties file is missing, create a new one
    const coreProperties = {
      id: database.id,
      title: database.name,
      created: new Date(),
      lastModified: new Date(),
    };

    // Write the core properties file
    await Fs.writeYamlFile(entryCorePropertiesFilePath(path), coreProperties);

    return coreProperties;
  }
}
