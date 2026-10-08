import { afterEach, describe, expect, it } from 'vitest';
import { Fs } from '../../FileSystem';
import { initializeMockFileSystem } from '../../mock';
import {
  MockReadDirInterception,
  interceptMockReadDir,
} from './interceptMockReadDir';

const WorkspacePath = 'workspace';
const NotesPath = 'workspace/notes';
const AddedNotePath = 'workspace/notes/added.md';

const MockFileSystem = initializeMockFileSystem([
  WorkspacePath,
  NotesPath,
  'workspace/notes/note.md',
]);

let interception: MockReadDirInterception;
// The number of times the callback ran
let runs = 0;

// Adds a file to the notes directory, counting the run
const addNote = async (): Promise<void> => {
  runs += 1;
  MockFileSystem.addFiles([AddedNotePath]);
};

describe('interceptMockReadDir', () => {
  afterEach(async () => {
    interception.restore();
    runs = 0;
    await Fs.tests.cleanup();
  });

  it('runs the callback before the listing goes ahead', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      onRead: addNote,
    });

    const entries = await Fs.readDir(NotesPath);

    expect(entries.map((entry) => entry.path)).toContain(AddedNotePath);
  });

  it('records that the callback ran', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      onRead: addNote,
    });

    await Fs.readDir(NotesPath);

    expect(interception.ran).toBe(true);
  });

  it('runs the callback only once', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      onRead: addNote,
    });

    await Fs.readDir(NotesPath);
    await Fs.readDir(NotesPath);

    expect(runs).toBe(1);
  });

  it('leaves listings of other directories alone', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      onRead: addNote,
    });

    await Fs.readDir(WorkspacePath);

    expect(interception.ran).toBe(false);
  });

  it('waits for a listing of the after path before intercepting', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      afterPath: WorkspacePath,
      onRead: addNote,
    });

    await Fs.readDir(NotesPath);

    expect(interception.ran).toBe(false);

    await Fs.readDir(WorkspacePath);
    await Fs.readDir(NotesPath);

    expect(interception.ran).toBe(true);
  });

  it('stops intercepting once restored', async () => {
    interception = interceptMockReadDir(MockFileSystem, {
      path: NotesPath,
      onRead: addNote,
    });

    interception.restore();
    await Fs.readDir(NotesPath);

    expect(interception.ran).toBe(false);
  });
});
