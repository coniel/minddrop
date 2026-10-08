import { afterEach, describe, expect, it, vi } from 'vitest';
import { hasPendingOperations } from '../PendingOperationsStore';
import { initializeMockFileSystem } from '../mock';
import { BaseDirectory } from '../types';
import {
  clearWriteRegistry,
  matchesWrittenContents,
  matchesWrittenStats,
} from '../writeRegistry';
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
  afterEach(clearWriteRegistry);

  it('records the written contents as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeJsonFile('file.json', { key: 'value' });

    expect(
      matchesWrittenContents('file.json', await Fs.readTextFile('file.json')),
    ).toBe(true);
  });
});

describe('Fs.writeTextFile', () => {
  afterEach(clearWriteRegistry);

  it('records a write into a base directory under its absolute path', async () => {
    initializeMockFileSystem();

    await Fs.writeTextFile('config.json', '{}', {
      baseDir: BaseDirectory.AppData,
    });

    expect(
      matchesWrittenContents(resolveAppDataPath('config.json'), '{}'),
    ).toBe(true);
  });
});

describe('Fs.writeTextFile before the base directory paths resolve', () => {
  it('writes into a base directory without recording the write', async () => {
    const { Fs, matchesWrittenContents } = await registerUnresolvedFileSystem();

    await expect(
      Fs.writeTextFile('config.json', '{}', { baseDir: BaseDirectory.AppData }),
    ).resolves.toBeUndefined();

    // The mock adapter resolves a base directory's path to its name
    expect(
      matchesWrittenContents(`${BaseDirectory.AppData}/config.json`, '{}'),
    ).toBe(false);
    expect(matchesWrittenContents('config.json', '{}')).toBe(false);
  });

  it('records a write under its absolute path once the paths resolve', async () => {
    const { Fs, matchesWrittenContents, resolveBaseDirPaths } =
      await registerUnresolvedFileSystem();

    await resolveBaseDirPaths();
    await Fs.writeTextFile('config.json', '{}', {
      baseDir: BaseDirectory.AppData,
    });

    // The mock adapter resolves a base directory's path to its name
    expect(
      matchesWrittenContents(`${BaseDirectory.AppData}/config.json`, '{}'),
    ).toBe(true);
  });
});

describe('Fs.writeYamlFile', () => {
  afterEach(clearWriteRegistry);

  it('records the written contents as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeYamlFile('file.yaml', { key: 'value' });

    expect(
      matchesWrittenContents('file.yaml', await Fs.readTextFile('file.yaml')),
    ).toBe(true);
  });
});

describe('Fs.writeBinaryFile', () => {
  afterEach(clearWriteRegistry);

  it('records the written file stats as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.writeBinaryFile('binary.png', new Blob(['bytes']));

    expect(matchesWrittenStats('binary.png', await Fs.stat('binary.png'))).toBe(
      true,
    );
  });

  it('records a write into a base directory under its absolute path', async () => {
    initializeMockFileSystem();

    await Fs.writeBinaryFile('base-dir-binary.png', new Blob(['bytes']), {
      baseDir: BaseDirectory.AppData,
    });

    const absolutePath = resolveAppDataPath('base-dir-binary.png');

    expect(matchesWrittenStats(absolutePath, await Fs.stat(absolutePath))).toBe(
      true,
    );
  });
});

describe('Fs.copyFile', () => {
  afterEach(clearWriteRegistry);

  it('records the copy stats as a self-write', async () => {
    initializeMockFileSystem([{ path: 'source.png', textContent: 'bytes' }]);

    await Fs.copyFile('source.png', 'copy.png');

    expect(matchesWrittenStats('copy.png', await Fs.stat('copy.png'))).toBe(
      true,
    );
  });

  it('records a copy into a base directory under its absolute path', async () => {
    initializeMockFileSystem([{ path: 'source.png', textContent: 'bytes' }]);

    await Fs.copyFile('source.png', 'base-dir-copy.png', {
      toPathBaseDir: BaseDirectory.AppData,
    });

    const absolutePath = resolveAppDataPath('base-dir-copy.png');

    expect(matchesWrittenStats(absolutePath, await Fs.stat(absolutePath))).toBe(
      true,
    );
  });
});

describe('Fs.downloadFile', () => {
  afterEach(clearWriteRegistry);

  it('records the downloaded file stats as a self-write', async () => {
    initializeMockFileSystem();

    await Fs.downloadFile('https://example.com/image.png', 'download.png');

    expect(
      matchesWrittenStats('download.png', await Fs.stat('download.png')),
    ).toBe(true);
  });

  it('records a download into a base directory under its absolute path', async () => {
    initializeMockFileSystem();

    await Fs.downloadFile(
      'https://example.com/image.png',
      'base-dir-download.png',
      { baseDir: BaseDirectory.AppData },
    );

    const absolutePath = resolveAppDataPath('base-dir-download.png');

    expect(matchesWrittenStats(absolutePath, await Fs.stat(absolutePath))).toBe(
      true,
    );
  });
});

describe('Fs.stat on the mock file system', () => {
  it("reports the byte size of a text file's contents", async () => {
    // Two and three bytes in UTF-8
    initializeMockFileSystem([{ path: 'text.txt', textContent: 'é€' }]);

    const stats = await Fs.stat('text.txt');

    expect(stats.size).toBe(5);
  });

  it("reports a binary file's size", async () => {
    initializeMockFileSystem();

    await Fs.writeBinaryFile('binary.png', new Blob(['bytes']));

    const stats = await Fs.stat('binary.png');

    expect(stats.size).toBe(5);
  });

  it("keeps a configured size over the contents' size", async () => {
    const mockFileSystem = initializeMockFileSystem([
      { path: 'text.txt', textContent: 'contents' },
    ]);

    mockFileSystem.setFileStats('text.txt', {
      created: new Date('2026-01-01T00:00:00.000Z'),
      lastModified: new Date('2026-01-01T00:00:00.000Z'),
      size: 1000,
    });

    const stats = await Fs.stat('text.txt');

    expect(stats.size).toBe(1000);
  });
});

/**
 * Resolves a path within the app data base directory to the absolute
 * path the mock file system holds it at.
 *
 * @param path - The path within the app data directory.
 * @returns The absolute path.
 */
function resolveAppDataPath(path: string): string {
  return Fs.concatPath(Fs.resolveBaseDirPath(BaseDirectory.AppData), path);
}

/**
 * Loads a fresh copy of the file system module, whose base directory
 * paths have never resolved, and registers a mock adapter on it whose
 * base directory paths resolve only when told to.
 *
 * @returns The fresh `Fs`, its write registry matcher, and a function resolving the base directory paths.
 */
async function registerUnresolvedFileSystem() {
  // Create a mock adapter on the current module
  const { MockFs } = initializeMockFileSystem();
  // The pending base directory path resolutions
  const resolvers: VoidFunction[] = [];

  // Load fresh copies of the file system and write registry modules
  vi.resetModules();
  const fresh = await import('./FileSystem');
  const registry = await import('../writeRegistry');

  // Register the mock adapter, holding back its base directory paths
  fresh.Fs.registerAdapter(
    {
      ...MockFs,
      resolveBaseDirPath: (baseDir) =>
        new Promise((resolve) => resolvers.push(() => resolve(baseDir))),
    },
    { skipQueue: true },
  );

  return {
    Fs: fresh.Fs,
    matchesWrittenContents: registry.matchesWrittenContents,
    resolveBaseDirPaths: async () => {
      resolvers.forEach((resolve) => resolve());

      // Let the resolved paths be stored
      await new Promise((resolve) => setTimeout(resolve, 0));
    },
  };
}
