import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { ViewsDirName } from '../constants';

export function getViewsDirPath() {
  return Fs.concatPath(Paths.workspace, Paths.hiddenDirName, ViewsDirName);
}
