import { describe, expect, it } from 'vitest';
import { hasPendingOperations } from '../PendingOperationsStore';
import { initializeMockFileSystem } from '../mock';
import { Fs } from './FileSystem';

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
