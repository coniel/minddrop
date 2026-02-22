import { BaseDirectory } from './BaseDirectory.types';
import { FileSystemAdapter } from './FileSystemAdapter.types';

export interface FileSystem extends Omit<FileSystemAdapter, 'getBaseDirPath'> {
  getBaseDirPath(dir: BaseDirectory): string;
}
