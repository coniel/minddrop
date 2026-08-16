import { FileSystemChange } from './types';

export const FileSystemChangedEvent = 'file-system:changed';

export type FileSystemChangedEventData = FileSystemChange;
