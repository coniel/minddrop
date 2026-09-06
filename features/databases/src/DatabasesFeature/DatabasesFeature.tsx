import { useEffect, useState } from 'react';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import { Views } from '@minddrop/views';
import { DatabaseEntryDialog } from '../DatabaseEntryDialog';
import { DatabaseEntryRendererProps } from '../DatabaseEntryRenderer';
import { NewDatabaseDialog } from '../NewDatabaseDialog';
import {
  CloseDatabaseEntryDialogEvent,
  DatabaseEntriesEventListenerId,
  DatabaseEntryViewName,
  DatabaseViewName,
  EventListenerId,
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
      Events.dispatch(Views.events.Close, {
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
      Events.dispatch(Views.events.Close, {
        id: tabView.id ?? resolveDatabaseViewId(props.databaseId),
      });
    });

    // Listen for open database view events, and open the database view
    // when one is received
    Events.addListener(Databases.events.OpenView, EventListenerId, (data) => {
      const database = Databases.get(data.databaseId);

      // Open a blank tab to receive the database view
      if (data.openMode === 'new-tab') {
        Tabs.newTab(data.viewAreaId ?? Views.constants.DefaultAreaId);
      }

      // Open the database view, which has no dialog or panel
      // presentation and so opens in place for those modes
      Events.dispatch(Views.events.Open, {
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
      DatabaseEntries.events.OpenView,
      DatabaseEntriesEventListenerId,
      (data) => {
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
          Tabs.newTab(data.viewAreaId ?? Views.constants.DefaultAreaId);
        }

        // Open the entry view in place of the current view (or in split view)
        Events.dispatch(Views.events.Open, {
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
    Events.addListener(Databases.events.Updated, EventListenerId, (data) => {
      Events.dispatch(Views.events.Update, {
        id: resolveDatabaseViewId(data.original.id),
        newId: resolveDatabaseViewId(data.updated.id),
        props: { databaseId: data.updated.id },
        title: data.updated.name,
        icon: data.updated.icon,
      });
    });

    // Update the database's open view title when the database
    // is renamed
    Events.addListener(Databases.events.Renamed, EventListenerId, (data) => {
      Events.dispatch(Views.events.Update, {
        id: resolveDatabaseViewId(data.updated.id),
        title: data.updated.name,
        icon: data.updated.icon,
      });
    });

    // Close the database's open view when the database is deleted
    Events.addListener(Databases.events.Deleted, EventListenerId, (data) => {
      Events.dispatch(Views.events.Close, {
        id: resolveDatabaseViewId(data.id),
      });
    });

    // Close open entry views when the database is deleted. Gather the
    // database's entries and close each entry's open view.
    Events.addListener(
      Databases.events.Deleted,
      DatabaseEntriesEventListenerId,
      (data) => {
        // Collect the database's entries
        const entries = DatabaseEntries.getAll(data.id);

        entries.forEach((entry) => {
          // Close the entry's open view
          Events.dispatch(Views.events.Close, {
            id: resolveDatabaseEntryViewId(entry.id),
          });
        });
      },
    );

    // Update an entry's open view title when the entry is renamed
    Events.addListener(
      DatabaseEntries.events.Renamed,
      DatabaseEntriesEventListenerId,
      (data) => {
        Events.dispatch(Views.events.Update, {
          id: resolveDatabaseEntryViewId(data.updated.id),
          title: data.updated.title,
        });
      },
    );

    // Close an entry's open view when the entry is deleted
    Events.addListener(
      DatabaseEntries.events.Deleted,
      DatabaseEntriesEventListenerId,
      (data) => {
        Events.dispatch(Views.events.Close, {
          id: resolveDatabaseEntryViewId(data.id),
        });
      },
    );

    // Open the entry a reference names. References are dispatched to the app
    // at large, so those naming no entry belong to something else and are
    // left alone.
    Events.addListener(
      Events.events.OpenReference,
      DatabaseEntriesEventListenerId,
      (data) => {
        const entry = DatabaseEntries.findByReference(data.reference);

        if (!entry) {
          return;
        }

        Events.dispatch(DatabaseEntries.events.OpenView, { entryId: entry.id });
      },
    );

    // Register feature-level event handlers (view state cleanup)
    initializeDatabasesFeatureEventHandlers();

    return () => {
      Events.removeListener(Databases.events.OpenView, EventListenerId);
      Events.removeListener(
        DatabaseEntries.events.OpenView,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        CloseDatabaseEntryDialogEvent,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        Events.events.OpenReference,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(Databases.events.Updated, EventListenerId);
      Events.removeListener(Databases.events.Renamed, EventListenerId);
      Events.removeListener(Databases.events.Deleted, EventListenerId);
      Events.removeListener(
        Databases.events.Deleted,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        DatabaseEntries.events.Renamed,
        DatabaseEntriesEventListenerId,
      );
      Events.removeListener(
        DatabaseEntries.events.Deleted,
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
