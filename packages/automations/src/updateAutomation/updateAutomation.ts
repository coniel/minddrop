import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationUpdatedEvent } from '../events';
import { getAutomation } from '../getAutomation';
import { Automation } from '../types';
import { writeAutomation } from '../writeAutomation';

export type UpdateAutomationData = Partial<
  Pick<Automation, 'name' | 'icon' | 'enabled' | 'nodes' | 'connections'>
>;

/**
 * Updates an automation, updating it in the store and writing it to the
 * file system.
 *
 * @param automationId - The ID of the automation to update.
 * @param data - The automation data.
 * @returns The updated automation.
 *
 * @dispatches 'automations:automation:updated' event
 */
export async function updateAutomation(
  automationId: string,
  data: UpdateAutomationData,
): Promise<Automation> {
  // Get the automation
  const automation = getAutomation(automationId);

  // Update the automation
  const updatedAutomation: Automation = {
    ...automation,
    ...data,
    lastModified: new Date(),
  };

  // Update the automation in the store
  AutomationsStore.update(automationId, updatedAutomation);

  // Dispatch the automation updated event
  Events.dispatch(AutomationUpdatedEvent, {
    original: automation,
    updated: updatedAutomation,
  });

  // Write the automation config to the file system unless the
  // automation is virtual, in which case its owner persists it
  if (!automation.virtual) {
    await writeAutomation(automationId);
  }

  return updatedAutomation;
}
