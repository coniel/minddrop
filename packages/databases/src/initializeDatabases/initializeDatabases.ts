import {
  CollectionUpdatedEvent,
  CollectionUpdatedEventData,
} from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { Workspaces } from '@minddrop/workspaces';
import { loadCoreSerializers } from '../DatabaseEntrySerializers';
import { DatabasesStore } from '../DatabasesStore';
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
import { readWorkspaceDatabases } from '../readWorkspaceDatabases';

/**
 * Loads core entry serializers and the user's databases into the store.
 */
export async function initializeDatabases() {
  // Load core entry serializers into the store
  loadCoreSerializers();

  // Get all workspaces
  const workspaces = Workspaces.getAll();

  // Read database configs from all workspaces
  const databaseConfigs = (
    await Promise.all(
      workspaces.map((workspace) => readWorkspaceDatabases(workspace.path)),
    )
  ).flat();

  // Load database configs into the store
  DatabasesStore.load(databaseConfigs);

  // Initialize event handlers
  initializeEventHandlers();
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
