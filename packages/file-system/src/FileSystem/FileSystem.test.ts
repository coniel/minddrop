import { describe, expect, it } from 'vitest';
import { hasPendingOperations } from '../PendingOperationsStore';
import { initializeMockFileSystem } from '../mock';
import { matchesWrittenContents, matchesWrittenStats } from '../writeRegistry';
import { Fs } from './FileSystem';

describe('Fs.removeDir', () => {
  it('removes an empty directory', async () => {
    initializeMockFileSystem(['dir']);

    await Fs.removeDir('dir');

    await expect(Fs.exists('dir')).resolves.toBe(false);
  });

  it('removes a directory with contents when recursive', async () => {
    initializeMockFileSystem(['dir/file.txt']);

    await Fs.removeDir('dir', { recursive: true });

    await expect(Fs.exists('dir')).resolves.toBe(false);
  });

  it('refuses a directory with contents unless recursive', async () => {
    initializeMockFileSystem(['dir/file.txt']);

    await expect(Fs.removeDir('dir')).rejects.toThrow('not empty');
    await expect(Fs.exists('dir/file.txt')).resolves.toBe(true);
  });
});

describe('Fs.tests.cleanup', () => {
  it('waits for pending operations, then resets the adapter', async () => {
    initializeMockFileSystem();

    // Start a write without awaiting it
    const write = Fs.writeTextFile('file.txt', 'contents');

    await Fs.tests.cleanup();

    // The write landed before the reset, which then removed the file
    await expect(write).resolves.toBeUndefined();
    await expect(Fs.exists('file.txt')).resolves.toBe(false);
    expect(hasPendingOperations()).toBe(false);
  });

  it('keeps the initially loaded files', async () => {
    initializeMockFileSystem([{ path: 'loaded.txt', textContent: 'kept' }]);

    await Fs.removeFile('loaded.txt');
    await Fs.tests.cleanup();

    await expect(Fs.readTextFile('loaded.txt')).resolves.toBe('kept');
  });
});

describe('Fs.writeJsonFile', () => {
  it('records the written contents as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeJsonFile('file.json', { key: 'value' });

    expect(
      matchesWrittenContents('file.json', await Fs.readTextFile('file.json')),
    ).toBe(true);
  });
});

describe('Fs.writeYamlFile', () => {
  it('records the written contents as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeYamlFile('file.yaml', { key: 'value' });

    expect(
      matchesWrittenContents('file.yaml', await Fs.readTextFile('file.yaml')),
    ).toBe(true);
  });
});

describe('Fs.writeBinaryFile', () => {
  it('records the written file stats as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeBinaryFile('image.png', new Blob(['bytes']));

    expect(matchesWrittenStats('image.png', await Fs.stat('image.png'))).toBe(
      true,
    );
  });
});

describe('Fs.copyFile', () => {
  it('records the copy stats as a self-write', async () => {
    initializeMockFileSystem([{ path: 'source.png', textContent: 'bytes' }]);

    await Fs.copyFile('source.png', 'copy.png');

    expect(matchesWrittenStats('copy.png', await Fs.stat('copy.png'))).toBe(
      true,
    );
  });
});

describe('Fs.downloadFile', () => {
  it('records the downloaded file stats as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.downloadFile('https://example.com/image.png', 'image.png');

    expect(matchesWrittenStats('image.png', await Fs.stat('image.png'))).toBe(
      true,
    );
  });
});
