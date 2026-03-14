import { useEffect, useState } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DatabaseEntryDialog } from '../DatabaseEntryDialog';
import {
  DatabaseEntryRenderer,
  DatabaseEntryRendererProps,
} from '../DatabaseEntryRenderer';
import { DatabaseView, DatabaseViewProps } from '../DatabaseView';
import { DatabasesFeatureState } from '../DatabasesFeatureState';
import { NewDatabaseDialog } from '../NewDatabaseDialog';
import {
  DatabaseEntriesEventListenerId,
  EventListenerId,
  MainDatabaseEntryViewName,
  MainDatabaseViewName,
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

/**
 * Renders top-level database feature UI and registers event
 * listeners for opening database views and database entries.
 */
export const DatabasesFeature: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEntryId, setDialogEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Track the active database in the main content area.
    // Set the active database ID when a database view is opened,
    // clear it when any other view is opened.
    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      `${EventListenerId}:main-content`,
      ({ data }) => {
        if (data.view === MainDatabaseViewName) {
          const props = data.props as OpenDatabaseViewEventData | undefined;

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
        Events.dispatch<OpenMainContentViewEventData<DatabaseViewProps>>(
          OpenMainContentViewEvent,
          {
            view: MainDatabaseViewName,
            component: DatabaseView,
            props: data,
          },
        );
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

        if (openMode === 'full') {
          // Open the entry in the main content area
          Events.dispatch<
            OpenMainContentViewEventData<DatabaseEntryRendererProps>
          >(OpenMainContentViewEvent, {
            view: MainDatabaseEntryViewName,
            component: DatabaseEntryRenderer,
            props: { entryId: data.entryId, designType: 'page' },
          });
        } else {
          // Open the entry as a dialog overlay
          setDialogEntryId(data.entryId);
          setDialogOpen(true);
        }
      },
    );

    // Register feature-level event handlers (view state cleanup)
    initializeDatabasesFeatureEventHandlers();

    return () => {
      Events.removeListener(
        OpenMainContentViewEvent,
        `${EventListenerId}:main-content`,
      );
      Events.removeListener(OpenDatabaseViewEvent, EventListenerId);
      Events.removeListener(
        OpenDatabaseEntryViewEvent,
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
