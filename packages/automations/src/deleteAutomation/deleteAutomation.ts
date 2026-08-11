import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationDeletedEvent, AutomationDeletedEventData } from '../events';
import { getAutomation } from '../getAutomation';
import { resolveAutomationFilePath } from '../utils';

/**
 * Deletes an automation, removing it from the store and deleting it from the
 * file system.
 *
 * @param automationId - The ID of the automation to delete.
 *
 * @dispatches automations:automation:deleted
 */
export async function deleteAutomation(automationId: string): Promise<void> {
  // Get the automation
  const automation = getAutomation(automationId);

  // Delete the automation from the store
  AutomationsStore.remove(automationId);

  // Delete the automation config from the file system, virtual
  // automations having no file of their own
  if (!automation.virtual) {
    await Fs.removeFile(resolveAutomationFilePath(automationId));
  }

  // Dispatch the automation deleted event
  Events.dispatch<AutomationDeletedEventData>(
    AutomationDeletedEvent,
    automation,
  );
}
