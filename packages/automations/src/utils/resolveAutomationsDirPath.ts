import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { AutomationsDirName } from '../constants';

/**
 * Resolves the path to the automations directory within the workspace.
 *
 * @returns The path to the automations directory.
 */
export function resolveAutomationsDirPath() {
  return Fs.concatPath(
    Paths.workspace,
    Paths.hiddenDirName,
    AutomationsDirName,
  );
}
