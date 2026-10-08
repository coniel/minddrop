import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '../../FileSystem';
import { initializeMockFileSystem } from '../../mock';
import { FsWatchEvent } from '../../types';
import {
  CountingMockFileSystem,
  registerCountingMockFileSystem,
} from './registerCountingMockFileSystem';

const WorkspacePath = 'workspace';
const NotePath = 'workspace/note.md';
const NewNotePath = 'workspace/new-note.md';

const MockFileSystem = initializeMockFileSystem([
  WorkspacePath,
  { path: NotePath, textContent: 'Hello' },
]);

let counting: CountingMockFileSystem;
// Watch events reported to the mock's watchers
let watchEvents: FsWatchEvent[] = [];

describe('registerCountingMockFileSystem', () => {
  beforeEach(async () => {
    counting = registerCountingMockFileSystem(MockFileSystem);
    watchEvents = [];

    await Fs.watch([WorkspacePath], (event) => watchEvents.push(event));
  });

  afterEach(async () => {
    counting.restore();
    await Fs.tests.cleanup();
  });

  it('counts the text reads of each path', async () => {
    await Fs.readTextFile(NotePath);
    await Fs.readTextFiles([NotePath]);

    expect(counting.textReads.get(NotePath)).toBe(2);
  });

  it('counts the listings of each directory', async () => {
    await Fs.readDir(WorkspacePath);

    expect(counting.dirReads.get(WorkspacePath)).toBe(1);
  });

  it('counts the writes to each path', async () => {
    await Fs.writeTextFile(NotePath, 'Changed');
    await Fs.writeTextFiles([{ path: NotePath, contents: 'Changed again' }]);

    expect(counting.writes.get(NotePath)).toBe(2);
  });

  it('passes calls through to the mock adapter', async () => {
    await Fs.writeTextFile(NotePath, 'Changed');

    expect(MockFileSystem.readTextFile(NotePath)).toBe('Changed');
  });

  it('reports a write to an existing file as a modify event', async () => {
    await Fs.writeTextFile(NotePath, 'Changed');

    expect(watchEvents).toEqual([{ kind: 'modify', paths: [NotePath] }]);
  });

  it('reports a write creating a file as an any event', async () => {
    await Fs.writeTextFile(NewNotePath, 'New');

    expect(watchEvents).toEqual([{ kind: 'any', paths: [NewNotePath] }]);
  });

  it('reports a removal as an any event', async () => {
    await Fs.removeFile(NotePath);

    expect(watchEvents).toEqual([{ kind: 'any', paths: [NotePath] }]);
  });

  it('stops counting once restored', async () => {
    counting.restore();

    await Fs.readTextFile(NotePath);

    expect(counting.textReads.get(NotePath)).toBeUndefined();
  });
});
