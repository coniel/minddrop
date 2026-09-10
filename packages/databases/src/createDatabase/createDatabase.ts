import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { entityId } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseEntityType } from '../constants';
import { DatabaseCreatedEvent } from '../events';
import { getDatabaseDefaults } from '../getDatabaseDefaults';
import { Database, DatabaseAutomationTemplate } from '../types';
import { resolveDatabasePath } from '../utils';
import { writeDatabaseConfig } from '../writeDatabaseConfig';

export type CreateDatabaseOptions = Partial<
  Omit<Database, 'id' | 'created' | 'lastModified' | 'path' | 'automations'>
> & {
  name: string;
  entryName: string;
  icon: string;
  automations?: DatabaseAutomationTemplate[];
};

/**
 * Creates a new database with the specified options.
 *
 * @param parentDirPath - The path to the parent directory where the database directory will be created.
 * @param options - The database creation options.
 * @returns The new database.
 *
 * @dispatches databases:database:created
 */
export async function createDatabase(
  options: CreateDatabaseOptions,
): Promise<Database> {
  // The path to the database directory. Databases live at the
  // workspace root, so the name is the workspace relative path.
  const dbPath = resolveDatabasePath(options.name);

  // Ensure the database directory does not already exist
  if (await Fs.exists(dbPath)) {
    throw new Fs.errors.PathConflict(dbPath);
  }

  // Create automation instances from the provided automation templates
  const automations = [...(options.automations || [])].map((automation) => ({
    ...automation,
    id: entityId('automation'),
  }));

  // Generate the database config, applying the user-configured
  // defaults for new databases.
  const databaseConfig: Database = {
    ...getDatabaseDefaults(),
    properties: [],
    designId: null,
    designPropertyMap: {},
    colorProperty: null,
    defaultLayouts: {},
    views: [],
    designs: [],
    entryTemplates: [],
    ...options,
    id: entityId(DatabaseEntityType),
    // Databases live at the workspace root, so the directory name is
    // the database's workspace relative path.
    path: options.name,
    created: new Date(),
    lastModified: new Date(),
    automations,
  };

  // If the database has no automations, remove the automations property
  if (!databaseConfig.automations?.length) {
    delete databaseConfig.automations;
  }

  // Add the database to the store
  DatabasesStore.set(databaseConfig);

  // Dispatch database created event
  Events.dispatch(DatabaseCreatedEvent, databaseConfig);

  // Create the database directory at the specified path. Handlers of the
  // created event write into the directory, so it may already exist.
  await Fs.ensureDir(dbPath);

  // Write the database config to the file system
  await writeDatabaseConfig(databaseConfig.id);

  return databaseConfig;
}
