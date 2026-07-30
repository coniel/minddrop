import { Events } from '@minddrop/events';
import {
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '@minddrop/feature-designs';
import { OpenDatabaseViewEvent } from '../events';

/**
 * Opens the design studio with back navigation returning to the
 * database's configuration panel.
 *
 * @param databaseId - The ID of the database to return to.
 */
export function openDesignStudio(databaseId: string) {
  Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
    backEvent: OpenDatabaseViewEvent,
    backEventData: { databaseId, configurationPanelOpen: true },
  });
}
