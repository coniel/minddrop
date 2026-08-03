import { useEffect, useState } from 'react';
import {
  DatabaseDeletedEvent,
  DatabaseDeletedEventData,
  DatabaseEntries,
  DatabaseEntryDeletedEvent,
  DatabaseEntryDeletedEventData,
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
  DatabaseRenamedEvent,
  DatabaseRenamedEventData,
  DatabaseUpdatedEvent,
  DatabaseUpdatedEventData,
  Databases,
} from '@minddrop/databases';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
  ViewAreaChangedEvent,
  ViewAreaChangedEventData,
} from '@minddrop/events';
import { DatabaseEntryDialog } from '../DatabaseEntryDialog';
import { DatabaseEntryRendererProps } from '../DatabaseEntryRenderer';
import { DatabaseViewProps } from '../DatabaseView';
import { DatabasesFeatureState } from '../DatabasesFeatureState';
import { NewDatabaseDialog } from '../NewDatabaseDialog';
import {
  CloseDatabaseEntryDialogEvent,
  DatabaseEntriesEventListenerId,
  DatabaseEntryViewName,
  DatabaseViewName,
  EventListenerId,
  OpenDatabaseEntryViewEvent,
  OpenDatabaseEntryViewEventData,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';
import {
  cleanupDatabasesFeatureEventHandlers,
  initializeDatabasesFeatureEventHandlers,
} from '../initializeFeatureEventHandlers';
import { resolveOpenMode } from '../utils';

const DATABASE_FALLBACK_ICON = 'content-icon:shapes:inherit';

// Unique view instance ids used to match the views in tabs
const databaseViewId = (databaseId: string) =>
  `databases:database:${databaseId}`;
const databaseEntryViewId = (entryId: string) => `databases:entry:${entryId}`;

/**
 * Renders top-level database feature UI and registers event
 * listeners for opening database views and database entries.
 */
export const DatabasesFeature: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEntryId, setDialogEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Track the active database in the main content area.
    // Set the active database ID when a database view is shown,
    // clear it when any other view is shown.
    Events.addListener<ViewAreaChangedEventData>(
      ViewAreaChangedEvent,
      `${EventListenerId}:main-content`,
      ({ data }) => {
        if (data.main?.view === DatabaseViewName) {
          const props = data.main.props as
            | OpenDatabaseViewEventData
            | undefined;

          DatabasesFeatureState.set(
            'activeDatabaseId',
            props?.databaseId ?? null,
          );
        } else {
          DatabasesFeatureState.set('activeDatabaseId', null);
        }
      },
    );

    // Listen for open database view events, and open the database view
    // when one is received
    Events.addListener<OpenDatabaseViewEventData>(
      OpenDatabaseViewEvent,
      EventListenerId,
      ({ data }) => {
        const database = Databases.get(data.databaseId, false);

        Events.dispatch<OpenViewEventData<DatabaseViewProps>>(OpenViewEvent, {
          view: DatabaseViewName,
          id: databaseViewId(data.databaseId),
          props: data,
          title: database?.name,
          icon: database?.icon || DATABASE_FALLBACK_ICON,
        });
      },
    );

    // Listen for database entry open events and open the entry
    // in the appropriate mode
    Events.addListener<OpenDatabaseEntryViewEventData>(
      OpenDatabaseEntryViewEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        // Resolve the open mode, falling back to the database default
        const openMode = resolveOpenMode(data.entryId, data.openMode);

        if (openMode === 'full' || openMode === 'split') {
          const entry = DatabaseEntries.get(data.entryId);
          const database = Databases.get(entry.database, false);

          // Open the entry in the main content area (or split view)
          Events.dispatch<OpenViewEventData<DatabaseEntryRendererProps>>(
            OpenViewEvent,
            {
              view: DatabaseEntryViewName,
              id: databaseEntryViewId(data.entryId),
              props: { entryId: data.entryId, layoutContext: 'page' },
              split: openMode === 'split',
              title: entry.title,
              icon: database?.icon || DATABASE_FALLBACK_ICON,
            },
          );
        } else {
          // Open the entry as a dialog overlay
          setDialogEntryId(data.entryId);
          setDialogOpen(true);
        }
      },
    );

    // Close the entry dialog when requested
    Events.addListener(
      CloseDatabaseEntryDialogEvent,
      DatabaseEntriesEventListenerId,
      () => {
        setDialogOpen(false);
      },
    );

    // Update the database's open view when the database changes
    // (e.g. re-iconed)
    Events.addListener<DatabaseUpdatedEventData>(
      DatabaseUpdatedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: databaseViewId(data.original.id),
          newId: databaseViewId(data.updated.id),
          props: { databaseId: data.updated.id },
          title: data.updated.name,
          icon: data.updated.icon || DATABASE_FALLBACK_ICON,
        });
      },
    );

    // Remap the database's open view when the database is renamed.
    // Rename changes the database ID, so the tab instance and props
    // must be re-pointed to the new ID.
    Events.addListener<DatabaseRenamedEventData>(
      DatabaseRenamedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: databaseViewId(data.original.id),
          newId: databaseViewId(data.updated.id),
          props: { databaseId: data.updated.id },
          title: data.updated.name,
          icon: data.updated.icon || DATABASE_FALLBACK_ICON,
        });
      },
    );

    // Remap open entry views when the database is renamed. Entry IDs are
    // database-prefixed, so a rename changes every entry ID. Entries may
    // already be re-keyed to the new database ID by the time this runs,
    // so gather them under both the old and new database ID.
    Events.addListener<DatabaseRenamedEventData>(
      DatabaseRenamedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        const { original, updated } = data;

        // Collect the database's entries regardless of re-key state
        const entries = [
          ...DatabaseEntries.getAll(original.id),
          ...DatabaseEntries.getAll(updated.id),
        ];

        entries.forEach((entry) => {
          // Swap the database prefix to derive the pre/post-rename IDs
          const relativePath = entry.id.slice(entry.database.length);
          const oldEntryId = `${original.id}${relativePath}`;
          const newEntryId = `${updated.id}${relativePath}`;

          // Re-point the entry's open view to the new entry ID
          Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
            id: databaseEntryViewId(oldEntryId),
            newId: databaseEntryViewId(newEntryId),
            props: { entryId: newEntryId, layoutContext: 'page' },
            title: entry.title,
          });
        });
      },
    );

    // Close the database's open view when the database is deleted
    Events.addListener<DatabaseDeletedEventData>(
      DatabaseDeletedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<CloseViewEventData>(CloseViewEvent, {
          id: databaseViewId(data.id),
        });
      },
    );

    // Close open entry views when the database is deleted. Gather the
    // database's entries and close each entry's open view.
    Events.addListener<DatabaseDeletedEventData>(
      DatabaseDeletedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        // Collect the database's entries
        const entries = DatabaseEntries.getAll(data.id);

        entries.forEach((entry) => {
          // Close the entry's open view
          Events.dispatch<CloseViewEventData>(CloseViewEvent, {
            id: databaseEntryViewId(entry.id),
          });
        });
      },
    );

    // Update an entry's open view when the entry is renamed
    Events.addListener<DatabaseEntryRenamedEventData>(
      DatabaseEntryRenamedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: databaseEntryViewId(data.original.id),
          newId: databaseEntryViewId(data.updated.id),
          props: { entryId: data.updated.id },
          title: data.updated.title,
        });
      },
    );

    // Close an entry's open view when the entry is deleted
    Events.addListener<DatabaseEntryDeletedEventData>(
      DatabaseEntryDeletedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        Events.dispatch<CloseViewEventData>(CloseViewEvent, {
          id: databaseEntryViewId(data.id),
        });
      },
    );

    // Register feature-level event handlers (view state cleanup)
    initializeDatabasesFeatureEventHandlers();

    return () => {
      Events.removeListener(
        ViewAreaChangedEvent,
        `${EventListenerId}:main-content`,
      );
      Events.removeListener(OpenDatabaseViewEvent, EventListenerId);
      Events.removeListener(
        OpenDatabaseEntryViewEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        CloseDatabaseEntryDialogEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(DatabaseUpdatedEvent, EventListenerId);
      Events.removeListener(DatabaseRenamedEvent, EventListenerId);
      Events.removeListener(
        DatabaseRenamedEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(DatabaseDeletedEvent, EventListenerId);
      Events.removeListener(
        DatabaseDeletedEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        DatabaseEntryRenamedEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        DatabaseEntryDeletedEvent,
        DatabaseEntriesEventListenerId,
      );
      cleanupDatabasesFeatureEventHandlers();
    };
  }, []);

  return (
    <>
      <NewDatabaseDialog />
      {dialogEntryId && (
        <DatabaseEntryDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          entryId={dialogEntryId}
        />
      )}
    </>
  );
};
