import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { DatabaseFileReadResult } from '../types';
import { readDatabaseResourceFiles } from './readDatabaseResourceFiles';

// A directory of resource files in the object database
const dirPath = `${databaseDirPath(objectDatabase)}/resources`;

describe('readDatabaseResourceFiles', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the resources and the IDs of those which cannot be read', async () => {
    MockFs.addFiles([
      { path: `${dirPath}/item_1.json`, textContent: 'read' },
      { path: `${dirPath}/item_2.json`, textContent: 'unreadable' },
      { path: `${dirPath}/item_3.json`, textContent: 'missing' },
    ]);

    expect(
      await readDatabaseResourceFiles(dirPath, readContents, 'json'),
    ).toEqual({
      resources: ['read'],
      unreadableIds: ['item_2'],
    });
  });

  it('leaves out files of another type', async () => {
    MockFs.addFiles([
      { path: `${dirPath}/item_1.json`, textContent: 'read' },
      { path: `${dirPath}/notes.txt`, textContent: 'unreadable' },
    ]);

    expect(
      await readDatabaseResourceFiles(dirPath, readContents, 'json'),
    ).toEqual({
      resources: ['read'],
      unreadableIds: [],
    });
  });

  it('reads a resource from each subdirectory when given no extension', async () => {
    MockFs.addFiles([
      { path: `${dirPath}/item_1/config.json`, textContent: 'read' },
      { path: `${dirPath}/item_2/config.json`, textContent: 'unreadable' },
    ]);

    expect(
      await readDatabaseResourceFiles(dirPath, (resourceDirPath) =>
        readContents(`${resourceDirPath}/config.json`),
      ),
    ).toEqual({ resources: ['read'], unreadableIds: ['item_2'] });
  });

  it('returns nothing for a missing directory', async () => {
    expect(
      await readDatabaseResourceFiles(dirPath, readContents, 'json'),
    ).toEqual({
      resources: [],
      unreadableIds: [],
    });
  });
});

/**
 * Reads a test resource file. Its contents name the read result.
 *
 * @param path - The path to the resource file.
 * @returns The contents as the resource, or the status they name.
 */
async function readContents(
  path: string,
): Promise<DatabaseFileReadResult<string>> {
  // Read the resource file
  const contents = await Fs.readTextFile(path);

  // Return the status the contents name
  if (contents === 'unreadable' || contents === 'missing') {
    return { status: contents };
  }

  // Otherwise, return the contents as the resource
  return { status: 'read', value: contents };
}
