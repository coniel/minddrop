import { BaseDirectory, FsFileOptions } from './types';

export const ConfigsFile = 'configs.json';
export const ConfigsFileOptions: FsFileOptions = {
  baseDir: BaseDirectory.AppData,
};

// How long the file system watcher waits for a path to stop changing
// before dispatching an event for it.
export const FileSystemWatcherDebounceMs = 200;
