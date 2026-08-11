import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import { AutomationsStore } from '../AutomationsStore';
import { DefaultAutomationIcon } from '../constants';
import { AutomationCreatedEvent, AutomationCreatedEventData } from '../events';
import { Automation, CreateVirtualAutomationData } from '../types';

/**
 * Creates a virtual automation which exists only in memory, adding it to the
 * store. Virtual automations are persisted by their owner.
 *
 * @param data - The virtual automation data. Requires an ID and an owner, the rest falling back to the defaults used for regular automations.
 * @returns The created automation.
 *
 * @dispatches automations:automation:created
 */
export function createVirtualAutomation(
  data: CreateVirtualAutomationData,
): Automation {
  // Generate the automation object
  const automation: Automation = {
    id: data.id,
    virtual: true,
    owner: data.owner,
    created: new Date(),
    lastModified: new Date(),
    name: data.name || i18n.t('automations.labels.automation'),
    icon: data.icon || DefaultAutomationIcon,
    enabled: data.enabled ?? true,
    nodes: [],
    connections: [],
  };

  // Add the automation to the store
  AutomationsStore.set(automation);

  // Dispatch the automation created event
  Events.dispatch<AutomationCreatedEventData>(
    AutomationCreatedEvent,
    automation,
  );

  return automation;
}
