import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { getAutomation } from '../getAutomation';
import { resolveAutomationFilePath, resolveAutomationsDirPath } from '../utils';

/**
 * Writes an automation to the file system.
 *
 * @param id - The ID of the automation to write.
 * @throws {AutomationNotFoundError} If the automation does not exist.
 * @throws {InvalidParameterError} If the automation is virtual.
 */
export async function writeAutomation(id: string): Promise<void> {
  // Get the automation
  const automation = getAutomation(id);

  // Virtual automations are persisted by their owner
  if (automation.virtual) {
    throw new InvalidParameterError(
      'Cannot write a virtual automation to the file system',
    );
  }

  // Ensure the automations directory exists
  await Fs.ensureDir(resolveAutomationsDirPath());

  // Write the automation config to the file system
  await Fs.writeJsonFile(resolveAutomationFilePath(id), automation);
}
