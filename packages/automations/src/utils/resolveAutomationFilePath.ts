import { Fs } from '@minddrop/file-system';
import { AutomationFileExtension } from '../constants';
import { resolveAutomationsDirPath } from './resolveAutomationsDirPath';

/**
 * Resolves the path to an automation file.
 *
 * @param id - The ID of the automation.
 * @returns The path to the automation file.
 */
export function resolveAutomationFilePath(id: string) {
  return Fs.concatPath(
    resolveAutomationsDirPath(),
    Fs.addFileExtension(id, AutomationFileExtension),
  );
}
