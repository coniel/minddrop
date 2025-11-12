import { Paths } from '@minddrop/utils';
import { DatabaseConfigFileName } from '../constants';

export function databaseConfigFilePath(dbPath: string): string {
  return `${dbPath}/${Paths.hiddenDirName}/${DatabaseConfigFileName}`;
}
