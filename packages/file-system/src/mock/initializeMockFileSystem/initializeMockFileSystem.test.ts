import { afterEach, describe, expect, it } from 'vitest';
import { Fs } from '../../FileSystem';
import { FsWatchEvent } from '../../types';
import { initializeMockFileSystem } from './initializeMockFileSystem';

const NotePath = 'workspace/note.md';

// A file and directory stored in one case, and the same paths in another
const WorkspacePath = 'Workspace';
const StoredPath = 'Workspace/Note.md';
const OtherCasePath = 'WORKSPACE/note.md';

// A name with an accented letter, composed as typed and decomposed as
// macOS stores it. Built from one literal so that a formatter
// normalising the source cannot make the two the same.
const ComposedName = 'Caf\u00e9.md'.normalize('NFC');
const DecomposedName = ComposedName.normalize('NFD');
const ComposedPath = `Workspace/${ComposedName}`;
const DecomposedPath = `Workspace/${DecomposedName}`;

// Fail the whole file if the two forms are the same
if (ComposedName === DecomposedName) {
  throw new Error('The composed and decomposed names must differ');
}

describe('initializeMockFileSystem', () => {
  afterEach(() => Fs.tests.cleanup());

  describe('addFiles', () => {
    it('empties an existing file given explicitly empty text content', () => {
      const MockFileSystem = initializeMockFileSystem([
        { path: NotePath, textContent: 'Hello' },
      ]);

      // Add the file again with empty text content
      MockFileSystem.addFiles([{ path: NotePath, textContent: '' }]);

      expect(MockFileSystem.readTextFile(NotePath)).toBe('');
    });
  });

  describe('case-insensitive matching', () => {
    /**
     * Initializes a file system with the stored file and the decomposed
     * file.
     *
     * @returns The mock file system.
     */
    const initialize = () =>
      initializeMockFileSystem([
        { path: StoredPath, textContent: 'Hello' },
        { path: DecomposedPath, textContent: 'Coffee' },
      ]);

    it('finds a file under another case', async () => {
      const { MockFs, exists } = initialize();

      expect(await MockFs.exists(OtherCasePath)).toBe(true);
      expect(exists(OtherCasePath)).toBe(true);
    });

    it('finds a file under another normalisation form', async () => {
      const { MockFs, exists } = initialize();

      expect(await MockFs.exists(ComposedPath)).toBe(true);
      expect(exists(ComposedPath)).toBe(true);
    });

    it('reads a text file under another case', async () => {
      const { MockFs, readTextFile } = initialize();

      expect(await MockFs.readTextFile(OtherCasePath)).toBe('Hello');
      expect(readTextFile(OtherCasePath)).toBe('Hello');
    });

    it('reads a text file under another normalisation form', async () => {
      const { MockFs, readTextFile } = initialize();

      expect(await MockFs.readTextFile(ComposedPath)).toBe('Coffee');
      expect(readTextFile(ComposedPath)).toBe('Coffee');
    });

    it('reads text files under another case, keyed by the given paths', async () => {
      const { MockFs } = initialize();

      const contents = await MockFs.readTextFiles([
        OtherCasePath,
        ComposedPath,
      ]);

      expect(contents.get(OtherCasePath)).toBe('Hello');
      expect(contents.get(ComposedPath)).toBe('Coffee');
    });

    it('reads JSON and YAML files under another case', async () => {
      const MockFileSystem = initializeMockFileSystem([
        { path: 'Workspace/Data.json', textContent: '{"a":1}' },
        { path: 'Workspace/Data.yaml', textContent: 'a: 1' },
      ]);

      expect(MockFileSystem.readJsonFile('workspace/data.JSON')).toEqual({
        a: 1,
      });
      expect(await MockFileSystem.readYamlFile('workspace/data.YAML')).toEqual({
        a: 1,
      });
    });

    it('lists a directory under another case, with names as stored', async () => {
      const { MockFs } = initialize();

      const entries = await MockFs.readDir(WorkspacePath.toLowerCase());

      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
    });

    it('checks whether a path is a directory under another case', async () => {
      const { MockFs } = initialize();

      expect(await MockFs.isDirectory(WorkspacePath.toLowerCase())).toBe(true);
    });

    it('writes to a file under another case, keeping its stored name', async () => {
      const { MockFs, readTextFile } = initialize();

      await MockFs.writeTextFile(OtherCasePath, 'Updated');

      const entries = await MockFs.readDir(WorkspacePath);

      expect(readTextFile(StoredPath)).toBe('Updated');
      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
    });

    it('writes to a file under another normalisation form, keeping its stored name', async () => {
      const { MockFs, readTextFile } = initialize();

      await MockFs.writeTextFile(ComposedPath, 'Tea');

      const entries = await MockFs.readDir(WorkspacePath);

      expect(readTextFile(DecomposedPath)).toBe('Tea');
      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
    });

    it('writes batched, JSON, YAML and binary files under another case, keeping the stored name', async () => {
      const MockFileSystem = initialize();
      const { MockFs } = MockFileSystem;

      await MockFs.writeTextFiles([
        { path: OtherCasePath, contents: 'Batched' },
      ]);
      expect(MockFileSystem.readTextFile(StoredPath)).toBe('Batched');

      MockFileSystem.writeTextFile(OtherCasePath, 'Direct');
      expect(MockFileSystem.readTextFile(StoredPath)).toBe('Direct');

      MockFileSystem.writeJsonFile(OtherCasePath, { a: 1 });
      expect(MockFileSystem.readJsonFile(StoredPath)).toEqual({ a: 1 });

      await MockFileSystem.writeYamlFile(OtherCasePath, { b: 2 });
      expect(await MockFileSystem.readYamlFile(StoredPath)).toEqual({ b: 2 });

      await MockFs.writeBinaryFile(OtherCasePath, new Blob(['12345']));
      expect((await MockFs.stat(StoredPath)).size).toBe(5);

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
    });

    it('creates a new file below the directory as stored', async () => {
      const { MockFs } = initialize();

      await MockFs.writeTextFile('workspace/New.md', 'New');

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries.map((entry) => entry.path)).toContain('Workspace/New.md');
    });

    it('reads and sets file stats under another case', async () => {
      const { MockFs, setFileStats } = initialize();
      const stats = {
        created: new Date('2025-01-01T00:00:00.000Z'),
        lastModified: new Date('2025-02-01T00:00:00.000Z'),
        size: 10,
      };

      setFileStats(OtherCasePath, stats);

      expect(await MockFs.stat(StoredPath)).toEqual(stats);
      expect(await MockFs.stat(OtherCasePath)).toEqual(stats);
    });

    it('renames a file to a name differing only in case', async () => {
      const { MockFs, readTextFile } = initialize();

      await MockFs.rename(StoredPath, 'Workspace/NOTE.md');

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries.map((entry) => entry.name)).toContain('NOTE.md');
      expect(entries.map((entry) => entry.name)).not.toContain('Note.md');
      expect(readTextFile('Workspace/NOTE.md')).toBe('Hello');
    });

    it('renames a directory given in another case, carrying its contents', async () => {
      const { MockFs, readTextFile } = initialize();

      await MockFs.rename(WorkspacePath.toLowerCase(), 'Renamed');

      expect(readTextFile('Renamed/Note.md')).toBe('Hello');
    });

    it('copies a file given in another case', async () => {
      const { MockFs, exists } = initialize();

      await MockFs.copyFile(OtherCasePath, 'Workspace/Copy.md');

      expect(exists('Workspace/Copy.md')).toBe(true);
    });

    it('removes a file under another case', async () => {
      const { MockFs, exists } = initialize();

      await MockFs.removeFile(OtherCasePath);

      expect(exists(StoredPath)).toBe(false);
    });

    it("removes a file's contents with it under another case", async () => {
      const { MockFs, readTextFile } = initialize();

      await MockFs.removeFile(OtherCasePath);
      await MockFs.downloadFile('https://example.com', StoredPath);

      expect(readTextFile(StoredPath)).toBe('');
    });

    it('removes a directory under another case', async () => {
      const { MockFs, exists } = initialize();

      await MockFs.removeDir(WorkspacePath.toLowerCase(), { recursive: true });

      expect(exists(WorkspacePath)).toBe(false);
    });

    it('trashes a file and a directory under another case', async () => {
      const { MockFs, exists, existsInTrash } = initialize();

      await MockFs.trashFile(OtherCasePath);

      expect(exists(StoredPath)).toBe(false);
      expect(existsInTrash(OtherCasePath)).toBe(true);

      await MockFs.trashDir(WorkspacePath.toLowerCase());

      expect(exists(WorkspacePath)).toBe(false);
    });

    it('treats an existing directory under another case as the same directory', async () => {
      const { MockFs } = initialize();

      await MockFs.createDir('WORKSPACE/Sub', { recursive: true });

      await expect(MockFs.createDir('workspace')).rejects.toThrow('EEXIST');
      expect(
        (await MockFs.readDir(WorkspacePath)).map((entry) => entry.path),
      ).toContain('Workspace/Sub');
    });

    it('downloads to an existing file under another case, keeping its stored name', async () => {
      const { MockFs } = initialize();

      await MockFs.downloadFile('https://example.com', OtherCasePath);

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
    });

    it('reports watch events for a watched path given in another case', async () => {
      const { MockFs, dispatchWatchEvent } = initialize();
      const events: FsWatchEvent[] = [];

      await MockFs.watch([WorkspacePath.toLowerCase()], (event) =>
        events.push(event),
      );

      dispatchWatchEvent('modify', [StoredPath]);

      expect(events).toEqual([{ kind: 'modify', paths: [StoredPath] }]);
    });

    it('reports watch events for a watched file given in another case', async () => {
      const { MockFs, dispatchWatchEvent } = initialize();
      const events: FsWatchEvent[] = [];

      await MockFs.watch([OtherCasePath], (event) => events.push(event));

      dispatchWatchEvent('modify', [StoredPath]);

      expect(events).toEqual([{ kind: 'modify', paths: [StoredPath] }]);
    });

    it('loads descriptors differing only in case as one file, keeping the first name and the last contents', async () => {
      const { MockFs, readTextFile } = initializeMockFileSystem([
        { path: 'Workspace/Meeting notes.md', textContent: 'First' },
        { path: 'Workspace/meeting notes.md', textContent: 'Second' },
      ]);

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries.map((entry) => entry.name)).toEqual(['Meeting notes.md']);
      expect(readTextFile('Workspace/Meeting notes.md')).toBe('Second');
    });

    it('loads descriptors differing only in normalisation form as one file', async () => {
      const { MockFs, readTextFile } = initializeMockFileSystem([
        { path: DecomposedPath, textContent: 'First' },
        { path: ComposedPath, textContent: 'Second' },
      ]);

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries.map((entry) => entry.name)).toEqual([DecomposedName]);
      expect(readTextFile(DecomposedPath)).toBe('Second');
    });

    it('adds a file differing only in case to an existing one as the same file', async () => {
      const MockFileSystem = initialize();

      MockFileSystem.addFiles([{ path: OtherCasePath, textContent: 'Added' }]);

      const entries = await MockFileSystem.MockFs.readDir(WorkspacePath);

      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Note.md', DecomposedName]),
      );
      expect(MockFileSystem.readTextFile(StoredPath)).toBe('Added');
    });
  });

  describe('case-sensitive matching', () => {
    it('loads descriptors differing only in case as separate files', async () => {
      const { MockFs, readTextFile } = initializeMockFileSystem(
        [
          { path: 'Workspace/Meeting notes.md', textContent: 'First' },
          { path: 'Workspace/meeting notes.md', textContent: 'Second' },
        ],
        { caseSensitive: true },
      );

      const entries = await MockFs.readDir(WorkspacePath);

      expect(entries).toHaveLength(2);
      expect(entries.map((entry) => entry.name)).toEqual(
        expect.arrayContaining(['Meeting notes.md', 'meeting notes.md']),
      );
      expect(readTextFile('Workspace/Meeting notes.md')).toBe('First');
      expect(readTextFile('Workspace/meeting notes.md')).toBe('Second');
    });

    it('loads descriptors differing only in normalisation form as separate files', async () => {
      const { MockFs } = initializeMockFileSystem(
        [DecomposedPath, ComposedPath],
        { caseSensitive: true },
      );

      expect(await MockFs.readDir(WorkspacePath)).toHaveLength(2);
    });

    it('matches paths exactly', async () => {
      const { MockFs, exists } = initializeMockFileSystem(
        [{ path: StoredPath, textContent: 'Hello' }, DecomposedPath],
        { caseSensitive: true },
      );

      expect(await MockFs.exists(OtherCasePath)).toBe(false);
      expect(exists(ComposedPath)).toBe(false);
      await expect(MockFs.readTextFile(OtherCasePath)).rejects.toThrow();
    });

    it('creates a separate file when writing under another case', async () => {
      const { MockFs, readTextFile } = initializeMockFileSystem(
        [{ path: StoredPath, textContent: 'Hello' }],
        { caseSensitive: true },
      );

      await MockFs.writeTextFile('Workspace/NOTE.md', 'Other');

      expect(readTextFile(StoredPath)).toBe('Hello');
      expect(readTextFile('Workspace/NOTE.md')).toBe('Other');
    });
  });
});

describe('copies, renames and removals', () => {
  afterEach(() => Fs.tests.cleanup());

  // Configured stats, differing from the defaults
  const stats = {
    created: new Date('2025-01-01T00:00:00.000Z'),
    lastModified: new Date('2025-02-01T00:00:00.000Z'),
    size: 10,
  };

  it("copies a text file's contents", async () => {
    const { MockFs, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    await MockFs.copyFile(NotePath, 'workspace/copy.md');

    expect(readTextFile('workspace/copy.md')).toBe('Hello');
  });

  it("copies a binary file's contents", async () => {
    const { MockFs } = initializeMockFileSystem([
      { path: 'workspace/image.png', binaryFile: new Blob(['bytes']) },
    ]);

    await MockFs.copyFile('workspace/image.png', 'workspace/copy.png');

    // With no configured stats, the size is that of the copied blob
    expect((await MockFs.stat('workspace/copy.png')).size).toBe(5);
  });

  it("copies a file's stats", async () => {
    const { MockFs, setFileStats } = initializeMockFileSystem([
      { path: 'workspace/image.png', binaryFile: new Blob(['bytes']) },
    ]);

    setFileStats('workspace/image.png', stats);

    await MockFs.copyFile('workspace/image.png', 'workspace/copy.png');

    expect(await MockFs.stat('workspace/copy.png')).toEqual(stats);
  });

  it("copies a directory's files with their contents", async () => {
    const { MockFs, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    await MockFs.copyFile('workspace', 'copy');

    expect(readTextFile('copy/note.md')).toBe('Hello');
  });

  it('leaves the original contents in place after a copy', async () => {
    const { MockFs, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    await MockFs.copyFile(NotePath, 'workspace/copy.md');

    expect(readTextFile(NotePath)).toBe('Hello');
  });

  it("carries a file's stats with it when renamed", async () => {
    const { MockFs, setFileStats } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    setFileStats(NotePath, stats);

    await MockFs.rename(NotePath, 'workspace/renamed.md');

    expect(await MockFs.stat('workspace/renamed.md')).toEqual(stats);
  });

  it("removes a file's binary contents and stats with it", async () => {
    const { MockFs, setFileStats } = initializeMockFileSystem([
      { path: 'workspace/image.png', binaryFile: new Blob(['bytes']) },
    ]);

    setFileStats('workspace/image.png', stats);

    await MockFs.removeFile('workspace/image.png');

    // Create a new file at the same path. It should start empty, with default stats.
    await MockFs.downloadFile('https://example.com', 'workspace/image.png');

    expect(await MockFs.stat('workspace/image.png')).not.toEqual(stats);
    expect((await MockFs.stat('workspace/image.png')).size).toBe(0);
  });

  it("removes a file's contents and stats through the test helper", async () => {
    const MockFileSystem = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    MockFileSystem.setFileStats(NotePath, stats);
    MockFileSystem.removeFile(NotePath);

    // Create a new file at the same path. It should start empty, with default stats.
    MockFileSystem.addFiles([NotePath]);

    expect(MockFileSystem.readTextFile(NotePath)).toBe('');
    expect(await MockFileSystem.MockFs.stat(NotePath)).not.toEqual(stats);
  });

  it("removes a trashed file's contents and stats", async () => {
    const { MockFs, setFileStats, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    setFileStats(NotePath, stats);

    await MockFs.trashFile(NotePath);

    // Create a new file at the same path. It should start empty, with default stats.
    await MockFs.downloadFile('https://example.com', NotePath);

    expect(readTextFile(NotePath)).toBe('');
    expect(await MockFs.stat(NotePath)).not.toEqual(stats);
  });

  it("removes a directory's file contents and stats", async () => {
    const { MockFs, setFileStats, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    setFileStats(NotePath, stats);

    await MockFs.removeDir('workspace', { recursive: true });

    // Create a new file at the same path. It should start empty, with default stats.
    await MockFs.createDir('workspace');
    await MockFs.downloadFile('https://example.com', NotePath);

    expect(readTextFile(NotePath)).toBe('');
    expect(await MockFs.stat(NotePath)).not.toEqual(stats);
  });

  it("removes a directory's file contents and stats through the test helper", async () => {
    const MockFileSystem = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    MockFileSystem.setFileStats(NotePath, stats);
    MockFileSystem.removeDir('workspace', { recursive: true });

    // Create a new file at the same path. It should start empty, with default stats.
    MockFileSystem.addFiles([NotePath]);

    expect(MockFileSystem.readTextFile(NotePath)).toBe('');
    expect(await MockFileSystem.MockFs.stat(NotePath)).not.toEqual(stats);
  });

  it("removes a trashed directory's file contents and stats", async () => {
    const { MockFs, setFileStats, readTextFile } = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    setFileStats(NotePath, stats);

    await MockFs.trashDir('workspace');

    // Create a new file at the same path. It should start empty, with default stats.
    await MockFs.createDir('workspace');
    await MockFs.downloadFile('https://example.com', NotePath);

    expect(readTextFile(NotePath)).toBe('');
    expect(await MockFs.stat(NotePath)).not.toEqual(stats);
  });

  it("clears every file's contents", () => {
    const MockFileSystem = initializeMockFileSystem([
      { path: NotePath, textContent: 'Hello' },
    ]);

    MockFileSystem.clear();

    // Create a new file at the same path. It should start empty.
    MockFileSystem.addFiles([NotePath]);

    expect(MockFileSystem.readTextFile(NotePath)).toBe('');
  });

  it('refuses to list a file as a directory', async () => {
    const { MockFs } = initializeMockFileSystem([NotePath]);

    await expect(MockFs.readDir(NotePath)).rejects.toThrow('not a dir');
  });
});
