import { useEffect, useState } from 'react';
import { DatabaseEntries } from '@minddrop/databases';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { Dialog, DialogRoot } from '@minddrop/ui-primitives';
import { DatabaseEntryRenderer } from '../DatabaseEntryRenderer';
import {
  DatabaseEntriesEventListenerId,
  OpenDatabaseEntryEvent,
  OpenDatabaseEntryEventData,
} from '../events';
import { resolveOpenMode } from '../utils';

export const DatabaseEntriesFeature: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEntryId, setDialogEntryId] = useState<string | null>(null);

  useEffect(() => {
    // Listen for database entry open events and open the entry
    // in the appropriate mode.
    Events.addListener<OpenDatabaseEntryEventData>(
      OpenDatabaseEntryEvent,
      DatabaseEntriesEventListenerId,
      ({ data }) => {
        // Resolve the open mode, falling back to the database default
        const openMode = resolveOpenMode(data.entryId, data.openMode);

        if (openMode === 'main-content') {
          // Open the entry in the main content area
          Events.dispatch<OpenMainContentViewEventData>(
            OpenMainContentViewEvent,
            {
              component: MainContentEntryPage,
              props: { entryId: data.entryId },
            },
          );
        } else {
          // Open the entry as a dialog overlay
          setDialogEntryId(data.entryId);
          setDialogOpen(true);
        }
      },
    );

    return () => {
      Events.removeListener(
        OpenDatabaseEntryEvent,
        DatabaseEntriesEventListenerId,
      );
    };
  }, []);

  return (
    <DialogRoot open={dialogOpen} onOpenChange={setDialogOpen}>
      <Dialog width="lg" noPadding>
        {dialogEntryId && <EntryDialogContent entryId={dialogEntryId} />}
      </Dialog>
    </DialogRoot>
  );
};

/**
 * Renders the content of the entry dialog using the
 * entry's page design.
 */
const EntryDialogContent: React.FC<{ entryId: string }> = ({ entryId }) => {
  // Get the entry data
  const entry = DatabaseEntries.use(entryId);

  if (!entry) {
    return null;
  }

  return <DatabaseEntryRenderer entryId={entryId} designType="page" />;
};

/**
 * Placeholder component rendered when an entry is opened
 * in the main content area.
 */
const MainContentEntryPage: React.FC<{ entryId: string }> = ({ entryId }) => {
  return <div>{entryId}</div>;
};
