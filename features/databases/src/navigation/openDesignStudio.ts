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
 * @param designId - The ID of the design to open in the editor.
 */
export function openDesignStudio(databaseId: string, designId?: string) {
  Events.dispatch<OpenDesignStudioEventData>(OpenDesignStudioEvent, {
    designId,
    backButtonLabel: 'databases.design.actions.back',
    backEvent: OpenDatabaseViewEvent,
    backEventData: { databaseId, configurationPanelOpen: true },
  });
}
