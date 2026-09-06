import { Paths } from '@minddrop/utils';
import { DatabaseConfigFileName } from '../constants';

export function resolveDatabaseConfigFilePath(dbPath: string): string {
  return `${dbPath}/${Paths.hiddenDirName}/${DatabaseConfigFileName}`;
}
