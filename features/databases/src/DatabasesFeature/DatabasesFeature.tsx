import { useEffect, useState } from 'react';
import {
  DatabaseDeletedEvent,
  DatabaseEntries,
  DatabaseEntryDeletedEvent,
  DatabaseEntryRenamedEvent,
  DatabaseRenamedEvent,
  DatabaseUpdatedEvent,
  Databases,
} from '@minddrop/databases';
import { Events, OpenReferenceEvent } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  CloseViewEvent,
  DefaultViewAreaId,
  OpenViewEvent,
  UpdateViewEvent,
} from '@minddrop/views';
import { DatabaseEntryDialog } from '../DatabaseEntryDialog';
import { DatabaseEntryRendererProps } from '../DatabaseEntryRenderer';
import { NewDatabaseDialog } from '../NewDatabaseDialog';
import {
  CloseDatabaseEntryDialogEvent,
  DatabaseEntriesEventListenerId,
  DatabaseEntryViewName,
  DatabaseViewName,
  EventListenerId,
  OpenDatabaseEntryViewEvent,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';
import {
  cleanupDatabasesFeatureEventHandlers,
  initializeDatabasesFeatureEventHandlers,
} from '../initializeFeatureEventHandlers';
import {
  resolveDatabaseEntryViewId,
  resolveDatabaseViewId,
  resolveOpenMode,
} from '../utils';

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
      if (DatabaseEntries.get(props.entryId, false)) {
        return;
      }

      // Close the view
      Events.dispatch(CloseViewEvent, {
        id: tabView.id ?? resolveDatabaseEntryViewId(props.entryId),
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
      Events.dispatch(CloseViewEvent, {
        id: tabView.id ?? resolveDatabaseViewId(props.databaseId),
      });
    });

    // Listen for open database view events, and open the database view
    // when one is received
    Events.addListener(OpenDatabaseViewEvent, EventListenerId, ({ data }) => {
      const database = Databases.get(data.databaseId);

      // Open a blank tab to receive the database view
      if (data.openMode === 'new-tab') {
        Tabs.newTab(data.viewAreaId ?? DefaultViewAreaId);
      }

      // Open the database view, which has no dialog or panel
      // presentation and so opens in place for those modes
      Events.dispatch(OpenViewEvent, {
        viewAreaId: data.viewAreaId,
        sourcePane: data.sourcePane,
        view: DatabaseViewName,
        id: resolveDatabaseViewId(data.databaseId),
        props: data,
        split: data.openMode === 'split',
        title: database.name,
        icon: database.icon,
      });
    });

    // Listen for database entry open events and open the entry
    // in the appropriate mode
    Events.addListener(
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
        const database = Databases.get(entry.database);

        // Open a blank tab to receive the entry view
        if (openMode === 'new-tab') {
          Tabs.newTab(data.viewAreaId ?? DefaultViewAreaId);
        }

        // Open the entry view in place of the current view (or in split view)
        Events.dispatch(OpenViewEvent, {
          viewAreaId: data.viewAreaId,
          sourcePane: data.sourcePane,
          view: DatabaseEntryViewName,
          id: resolveDatabaseEntryViewId(data.entryId),
          props: { entryId: data.entryId, layoutContext: 'page' },
          split: openMode === 'split',
          title: entry.title,
          icon: database.icon,
        });
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
    Events.addListener(DatabaseUpdatedEvent, EventListenerId, ({ data }) => {
      Events.dispatch(UpdateViewEvent, {
        id: resolveDatabaseViewId(data.original.id),
        newId: resolveDatabaseViewId(data.updated.id),
        props: { databaseId: data.updated.id },
        title: data.updated.name,
        icon: data.updated.icon,
      });
    });

    // Update the database's open view title when the database
    // is renamed
    Events.addListener(DatabaseRenamedEvent, EventListenerId, ({ data }) => {
      Events.dispatch(UpdateViewEvent, {
        id: resolveDatabaseViewId(data.updated.id),
        title: data.updated.name,
        icon: data.updated.icon,
      });
    });

    // Close the database's open view when the database is deleted
    Events.addListener(DatabaseDeletedEvent, EventListenerId, ({ data }) => {
      Events.dispatch(CloseViewEvent, {
        id: resolveDatabaseViewId(data.id),
      });
    });

    // Close open entry views when the database is deleted. Gather the
    // database's entries and close each entry's open view.
    Events.addListener(
      DatabaseDeletedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        // Collect the database's entries
        const entries = DatabaseEntries.getAll(data.id);

        entries.forEach((entry) => {
          // Close the entry's open view
          Events.dispatch(CloseViewEvent, {
            id: resolveDatabaseEntryViewId(entry.id),
          });
        });
      },
    );

    // Update an entry's open view title when the entry is renamed
    Events.addListener(
      DatabaseEntryRenamedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        Events.dispatch(UpdateViewEvent, {
          id: resolveDatabaseEntryViewId(data.updated.id),
          title: data.updated.title,
        });
      },
    );

    // Close an entry's open view when the entry is deleted
    Events.addListener(
      DatabaseEntryDeletedEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        Events.dispatch(CloseViewEvent, {
          id: resolveDatabaseEntryViewId(data.id),
        });
      },
    );

    // Open the entry a reference names. References are dispatched to the app
    // at large, so those naming no entry belong to something else and are
    // left alone.
    Events.addListener(
      OpenReferenceEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        const entry = DatabaseEntries.findByReference(data.reference);

        if (!entry) {
          return;
        }

        Events.dispatch(OpenDatabaseEntryViewEvent, { entryId: entry.id });
      },
    );

    // Register feature-level event handlers (view state cleanup)
    initializeDatabasesFeatureEventHandlers();

    return () => {
      Events.removeListener(OpenDatabaseViewEvent, EventListenerId);
      Events.removeListener(
        OpenDatabaseEntryViewEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        CloseDatabaseEntryDialogEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(OpenReferenceEvent, DatabaseEntriesEventListenerId);
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
