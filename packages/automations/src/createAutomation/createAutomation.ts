import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { entityId } from '@minddrop/utils';
import { AutomationsStore } from '../AutomationsStore';
import { DefaultAutomationIcon } from '../constants';
import { AutomationCreatedEvent } from '../events';
import { Automation } from '../types';
import { writeAutomation } from '../writeAutomation';

/**
 * Creates a new automation, adding it to the store and writing it to the
 * file system.
 *
 * @param name - The name of the automation, defaults to the automation type name.
 * @param icon - The automation icon, defaults to the default automation icon.
 *
 * @returns The created automation.
 *
 * @dispatches automations:automation:created
 */
export async function createAutomation(
  name?: string,
  icon?: string,
): Promise<Automation> {
  // Generate the automation object
  const automation: Automation = {
    id: entityId('automation'),
    created: new Date(),
    lastModified: new Date(),
    name: name || i18n.t('automations.labels.automation'),
    icon: icon || DefaultAutomationIcon,
    enabled: true,
    nodes: [],
    connections: [],
  };

  // Add the automation to the store
  AutomationsStore.set(automation);

  // Dispatch the automation created event
  Events.dispatch(AutomationCreatedEvent, automation);

  // Write the automation config to the file system
  await writeAutomation(automation.id);

  return automation;
}
