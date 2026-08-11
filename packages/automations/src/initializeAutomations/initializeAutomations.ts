import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { AutomationsStore } from '../AutomationsStore';
import { AutomationsLoadedEvent, AutomationsLoadedEventData } from '../events';
import { readAutomation } from '../readAutomation';
import { resolveAutomationsDirPath } from '../utils';

/**
 * Initializes automations by loading automation configs from the automations
 * directory.
 *
 * If the automations directory does not exist, it will be created.
 */
export async function initializeAutomations(): Promise<void> {
  const automationsDirPath = resolveAutomationsDirPath();

  // Ensure that the automations directory exists
  await Fs.ensureDir(automationsDirPath);

  // Load automations from the automations directory
  const files = await Fs.readDir(automationsDirPath);

  // Read the automation files
  const automationPromises = await Promise.all(
    files.map((file) => readAutomation(file.path)),
  );

  // Filter out null automations
  const automations = automationPromises.filter(
    (automation) => automation !== null,
  );

  // Load the automations into the store
  AutomationsStore.load(automations);

  // Dispatch an automations loaded event
  Events.dispatch<AutomationsLoadedEventData>(
    AutomationsLoadedEvent,
    automations,
  );
}
