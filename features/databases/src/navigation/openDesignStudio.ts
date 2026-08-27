import { DesignId } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { OpenDesignStudioEvent } from '@minddrop/feature-designs';

/**
 * Opens the design studio on the given design. The studio wires
 * the app's nav back action itself, returning to the previous view.
 *
 * @param designId - The ID of the design to open in the editor.
 */
export function openDesignStudio(designId?: DesignId) {
  Events.dispatch(OpenDesignStudioEvent, { designId });
}
