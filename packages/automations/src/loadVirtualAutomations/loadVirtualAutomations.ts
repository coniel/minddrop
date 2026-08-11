import { Events } from '@minddrop/events';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationsLoadedEvent, AutomationsLoadedEventData } from '../events';
import { Automation, VirtualAutomationData } from '../types';

/**
 * Loads virtual automations into the store without dispatching creation
 * events. Use this when hydrating virtual automations from their owner's
 * persisted data.
 *
 * @param data - The virtual automation data to load.
 *
 * @dispatches automations:loaded
 */
export function loadVirtualAutomations(data: VirtualAutomationData[]): void {
  // Generate virtual automation objects from the data
  const automations: Automation[] = data.map((item) => ({
    ...item,
    virtual: true,
    created: new Date(),
    lastModified: new Date(),
  }));

  // Load the automations into the store
  AutomationsStore.load(automations);

  // Dispatch an automations loaded event
  Events.dispatch<AutomationsLoadedEventData>(
    AutomationsLoadedEvent,
    automations,
  );
}
