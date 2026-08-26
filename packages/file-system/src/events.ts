import { FileSystemChange } from './types';

export const FileSystemChangedEvent = 'file-system:changed';

export type FileSystemChangedEventData = FileSystemChange;

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'file-system:changed': FileSystemChangedEventData;
  }
}
