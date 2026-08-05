import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ViewsDirName } from '../constants';

export function getViewsDirPath(workspacePath?: string) {
  return Fs.concatPath(
    workspacePath || Paths.workspace,
    Paths.hiddenDirName,
    ViewsDirName,
  );
}
