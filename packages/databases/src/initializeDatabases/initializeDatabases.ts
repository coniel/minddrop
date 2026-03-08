import {
  CollectionUpdatedEvent,
  CollectionUpdatedEventData,
} from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Fs, FsEntry } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { Workspace, Workspaces } from '@minddrop/workspaces';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseConfigFileName } from '../constants';
import { coreEntrySerializers } from '../entry-serializers';
import {
  onAddProperty,
  onCreateDatabase,
  onCreateEntry,
  onDeleteDatabase,
  onDeleteEntry,
  onRemoveProperty,
  onRenameDatabase,
  onRenameEntry,
  onRenameProperty,
  onUpdateCollection,
} from '../event-handlers';
import {
  DatabaseCreatedEvent,
  DatabaseCreatedEventData,
  DatabaseDeletedEvent,
  DatabaseDeletedEventData,
  DatabaseEntryCreatedEvent,
  DatabaseEntryCreatedEventData,
  DatabaseEntryDeletedEvent,
  DatabaseEntryDeletedEventData,
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
  DatabasePropertyAddedEvent,
  DatabasePropertyAddedEventData,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRemovedEventData,
  DatabasePropertyRenamedEvent,
  DatabasePropertyRenamedEventData,
  DatabaseRenamedEvent,
  DatabaseRenamedEventData,
} from '../events';
import { Database } from '../types';

/**
 * Loads core entry serializers and the user's databases into the store.
 */
export async function initializeDatabases() {
  // Load core entry serializers into the store
  DatabaseEntrySerializersStore.load(coreEntrySerializers);

  // Get all workspaces
  const workspaces = Workspaces.getAll();

  // Get database paths from workspaces
  const databasePaths = (
    await Promise.all(workspaces.map(getWorkspaceDatabasePaths))
  ).flat();

  // Read database configs
  const databaseConfigs = (
    await Promise.all(databasePaths.map(readDatabaseConfig))
  ).filter((config) => config !== null);

  // Load database configs into the store
  DatabasesStore.load(databaseConfigs);

  // Initialize event handlers
  initializeEventHandlers();
}

/**
 * Returns the paths to all databases in the specified workspace.
 *
 * @param workspace - The workspace to get the database paths from.
 * @returns The paths to all databases in the workspace.
 */
async function getWorkspaceDatabasePaths(
  workspace: Workspace,
): Promise<string[]> {
  const workspaceFiles = await Fs.readDir(workspace.path, { recursive: true });

  return findDatabasePaths(workspaceFiles);
}

/**
 * Finds all database paths in the specified directory.
 *
 * @param entries - The directory entries to search in.
 * @param inHiddenDir - Whether the current set of entries is in a .minddrop directory.
 * @returns The paths to all databases in the directory.
 */
function findDatabasePaths(entries: FsEntry[], inHiddenDir = false): string[] {
  return entries.flatMap((entry) => {
    const name = entry.path.split('/').pop();
    const isMinddropDir = name === Paths.hiddenDirName;

    if (entry.children) {
      return findDatabasePaths(entry.children, inHiddenDir || isMinddropDir);
    }

    return inHiddenDir && name === DatabaseConfigFileName ? [entry.path] : [];
  });
}

async function readDatabaseConfig(path: string): Promise<Database | null> {
  try {
    const config = await Fs.readJsonFile<Database>(path);

    return {
      ...config,
      // Remove .minddrop/database.json from the path
      path: path.split('/').slice(0, -2).join('/'),
    };
  } catch {
    return null;
  }
}

function initializeEventHandlers() {
  Events.on<DatabaseCreatedEventData>(
    DatabaseCreatedEvent,
    'databases',
    ({ data }) => {
      onCreateDatabase(data);
    },
  );

  Events.on<DatabaseDeletedEventData>(
    DatabaseDeletedEvent,
    'databases',
    ({ data }) => {
      onDeleteDatabase(data);
    },
  );

  Events.on<DatabaseRenamedEventData>(
    DatabaseRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameDatabase(data);
    },
  );

  Events.on<DatabasePropertyAddedEventData>(
    DatabasePropertyAddedEvent,
    'databases',
    ({ data }) => {
      onAddProperty(data);
    },
  );

  Events.on<DatabasePropertyRemovedEventData>(
    DatabasePropertyRemovedEvent,
    'databases',
    ({ data }) => {
      onRemoveProperty(data);
    },
  );

  Events.on<DatabasePropertyRenamedEventData>(
    DatabasePropertyRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameProperty(data);
    },
  );

  Events.on<DatabaseEntryCreatedEventData>(
    DatabaseEntryCreatedEvent,
    'databases',
    ({ data }) => {
      onCreateEntry(data);
    },
  );

  Events.on<DatabaseEntryDeletedEventData>(
    DatabaseEntryDeletedEvent,
    'databases',
    ({ data }) => {
      onDeleteEntry(data);
    },
  );

  Events.on<DatabaseEntryRenamedEventData>(
    DatabaseEntryRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameEntry(data);
    },
  );

  Events.on<CollectionUpdatedEventData>(
    CollectionUpdatedEvent,
    'databases',
    ({ data }) => {
      onUpdateCollection(data);
    },
  );
}
