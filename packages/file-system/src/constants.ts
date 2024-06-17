import { BaseDirectory, FsFileOptions } from './types';

export const ConfigsFile = 'configs.json';
export const ConfigsFileOptions: FsFileOptions = {
  baseDir: BaseDirectory.AppData,
};
