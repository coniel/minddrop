import { BaseDirectory, FsFileOptions } from '../types';

export const ConfigsFile = 'configs.json';
export const ConfigsFileOptions: FsFileOptions = {
  dir: BaseDirectory.AppData,
};
