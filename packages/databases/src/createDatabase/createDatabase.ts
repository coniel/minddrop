import { Design } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { uuid } from '@minddrop/utils';
import { View, Views } from '@minddrop/views';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseCreatedEvent } from '../events';
import { Database, DatabaseAutomationTemplate } from '../types';
import { writeDatabaseConfig } from '../writeDatabaseConfig';
import { writeDatabasesConfig } from '../writeDatabasesConfig';

export interface CreateDatabaseOptions
  extends Omit<
    Database,
    | 'id'
    | 'created'
    | 'lastModified'
    | 'path'
    | 'properties'
    | 'entrySerializer'
    | 'automations'
    | 'designs'
    | 'defaultDesigns'
    | 'views'
  > {
  properties?: Database['properties'];
  entrySerializer?: Database['entrySerializer'];
  automations?: DatabaseAutomationTemplate[];
  designs?: Design[];
  defaultDesigns?: {
    page?: string;
    card?: string;
    list?: string;
  };
  views?: View[];
}

/**
 * Creates a new database with the specified options.
 *
 * @param parentDirPath - The path to the parent directory where the database directory will be created.
 * @param options - The database creation options.
 * @returns The new database.
 *
 * @dispatches databases:database:create
 */
export async function createDatabase(
  parentDirPath: string,
  options: CreateDatabaseOptions,
): Promise<Database> {
  // The path to the database directory
  const dbPath = Fs.concatPath(parentDirPath, options.name);

  // Ensure the database directory does not already exist
  if (await Fs.exists(dbPath)) {
    throw new PathConflictError(dbPath);
  }

  // Create automation instances from the provided automation templates
  const automations = [...(options.automations || [])].map((automation) => ({
    ...automation,
    id: uuid(),
  }));

  // Generate the database config
  const databaseConfig: Database = {
    ...options,
    id: uuid(),
    path: dbPath,
    properties: options.properties || [],
    entrySerializer: options.entrySerializer || 'markdown',
    created: new Date(),
    lastModified: new Date(),
    automations,
    designs: options.designs || [],
    defaultDesigns: options.defaultDesigns || {},
    views: options.views || [Views.generate('wall')],
  };

  // If the database has no automations, remove the automations property
  if (!databaseConfig.automations?.length) {
    delete databaseConfig.automations;
  }

  // Add the database to the store
  DatabasesStore.add(databaseConfig);

  // Create the database directory at the specified path
  await Fs.createDir(dbPath);

  // Write the database config to the file system
  await writeDatabaseConfig(databaseConfig.id);

  // Add the database path to the user's databases config file
  await writeDatabasesConfig();

  // Dispatch database created event
  Events.dispatch(DatabaseCreatedEvent, databaseConfig);

  return databaseConfig;
}
