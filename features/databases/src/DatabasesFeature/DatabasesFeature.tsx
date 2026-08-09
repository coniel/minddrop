import { useEffect, useState } from 'react';
import {
  Database,
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
  ViewDescriptor,
} from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { DATABASE_FALLBACK_ICON } from '@minddrop/ui-databases';
import { DefaultViewAreaId } from '@minddrop/views';
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

// Unique view instance ids used to match the views in tabs
const databaseViewId = (databaseId: string) =>
  `databases:database:${databaseId}`;
const databaseEntryViewId = (entryId: string) => `databases:entry:${entryId}`;

// Descriptor of a database's view, used as the breadcrumb parent
// of its entry views
const databaseViewDescriptor = (database: Database): ViewDescriptor => ({
  view: DatabaseViewName,
  id: databaseViewId(database.id),
  props: { databaseId: database.id },
  title: database.name,
  icon: database.icon || DATABASE_FALLBACK_ICON,
});

/**
 * Renders top-level database feature UI and registers event
 * listeners for opening database views and database entries.
 */
export const DatabasesFeature: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEntryId, setDialogEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Close restored entry views whose entry no longer exists
    // (e.g. deleted externally or re-indexed while the app was closed)
    Tabs.getOpenTabs(DatabaseEntryViewName).forEach((tabView) => {
      const props = tabView.props as DatabaseEntryRendererProps | undefined;

      // Skip views without an entry ID
      if (!props?.entryId) {
        return;
      }

      // Skip views whose entry resolves
      if (DatabaseEntries.Store.get(props.entryId)) {
        return;
      }

      // Close the view
      Events.dispatch<CloseViewEventData>(CloseViewEvent, {
        id: tabView.id ?? databaseEntryViewId(props.entryId),
      });
    });

    // Close restored database views whose database no longer exists
    Tabs.getOpenTabs(DatabaseViewName).forEach((tabView) => {
      const props = tabView.props as OpenDatabaseViewEventData | undefined;

      // Skip views without a database ID
      if (!props?.databaseId) {
        return;
      }

      // Skip views whose database resolves
      if (Databases.get(props.databaseId, false)) {
        return;
      }

      // Close the view
      Events.dispatch<CloseViewEventData>(CloseViewEvent, {
        id: tabView.id ?? databaseViewId(props.databaseId),
      });
    });

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

        // Slide out panel is not yet implemented
        if (openMode === 'panel') {
          return;
        }

        // Open the entry as a dialog overlay
        if (openMode === 'dialog') {
          setDialogEntryId(data.entryId);
          setDialogOpen(true);

          return;
        }

        const entry = DatabaseEntries.get(data.entryId);
        const database = Databases.get(entry.database, false);

        // Open a blank tab to receive the entry view
        if (openMode === 'new-tab') {
          Tabs.newTab(DefaultViewAreaId);
        }

        // Open the entry view in place of the current view (or in split view)
        Events.dispatch<OpenViewEventData<DatabaseEntryRendererProps>>(
          OpenViewEvent,
          {
            view: DatabaseEntryViewName,
            id: databaseEntryViewId(data.entryId),
            props: { entryId: data.entryId, layoutContext: 'page' },
            split: openMode === 'split',
            title: entry.title,
            icon: database?.icon || DATABASE_FALLBACK_ICON,
            // The trail leads back to the entry's database view
            breadcrumbs: database
              ? [databaseViewDescriptor(database)]
              : undefined,
          },
        );
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

    // Update the database's open view title when the database
    // is renamed
    Events.addListener<DatabaseRenamedEventData>(
      DatabaseRenamedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: databaseViewId(data.updated.id),
          title: data.updated.name,
          icon: data.updated.icon || DATABASE_FALLBACK_ICON,
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

    // Update an entry's open view title when the entry is renamed
    Events.addListener<DatabaseEntryRenamedEventData>(
      DatabaseEntryRenamedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: databaseEntryViewId(data.updated.id),
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
