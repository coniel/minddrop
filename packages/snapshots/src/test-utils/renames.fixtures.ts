import { MockFileDescriptor } from '@minddrop/file-system';
import { RenameEvent } from '../types';

// Spelled out rather than resolved, so that the fixtures pin the paths
// down instead of agreeing with whatever the path utils produce
const renamesDirPath = 'path/to/workspaces/Workspace 1/.minddrop/renames';

export const entryRenameEvent: RenameEvent = {
  timestamp: new Date('2026-01-01T09:00:00.000Z'),
  from: 'Books/Book',
  to: 'Books/My Book',
  kind: 'entry',
};

export const propertyRenameEvent: RenameEvent = {
  timestamp: new Date('2026-01-02T09:00:00.000Z'),
  from: 'Books/Author',
  to: 'Books/Writer',
  kind: 'property',
};

export const databaseRenameEvent: RenameEvent = {
  timestamp: new Date('2026-01-03T09:00:00.000Z'),
  from: 'Books',
  to: 'Library',
  kind: 'database',
};

export const renameEvents = [
  entryRenameEvent,
  propertyRenameEvent,
  databaseRenameEvent,
];

// The fixture events' file names, spelled out for the same reason as
// the directory path above
const renameEventFileNames = [
  '20260101T090000000Z-my-book.json',
  '20260102T090000000Z-writer.json',
  '20260103T090000000Z-library.json',
];

export function getRenameEventFiles(): (string | MockFileDescriptor)[] {
  return [
    renamesDirPath,
    ...renameEvents.map((event, index) => ({
      path: `${renamesDirPath}/${renameEventFileNames[index]}`,
      textContent: JSON.stringify(event),
    })),
  ];
}
