import { Fs } from '@minddrop/file-system';
import { AutomationFileExtension } from '../constants';
import { resolveAutomationsDirPath } from './resolveAutomationsDirPath';

/**
 * Resolves the path to an automation file.
 *
 * @param id - The ID of the automation.
 * @param workspacePath - The workspace path. Defaults to the active workspace.
 * @returns The path to the automation file.
 */
export function resolveAutomationFilePath(id: string, workspacePath?: string) {
  return Fs.concatPath(
    resolveAutomationsDirPath(workspacePath),
    Fs.addFileExtension(id, AutomationFileExtension),
  );
}
