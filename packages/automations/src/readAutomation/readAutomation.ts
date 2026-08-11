import { Fs } from '@minddrop/file-system';
import { restoreDates } from '@minddrop/utils';
import { Automation } from '../types';

/**
 * Reads an automation from the file system, reviving serialized
 * dates.
 *
 * @param path - The path to the automation file.
 * @returns The automation or null if it doesn't exist or is invalid.
 */
export async function readAutomation(path: string): Promise<Automation | null> {
  try {
    // Read the automation config from the file system
    const automation = await Fs.readJsonFile<Automation>(path);

    // Discard configs missing the automation graph
    if (!automation.nodes) {
      return null;
    }

    // Revive serialized dates
    return restoreDates<Automation>(automation);
  } catch {
    return null;
  }
}
