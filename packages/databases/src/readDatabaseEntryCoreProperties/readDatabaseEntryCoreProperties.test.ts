import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  objectEntry1CorePropertiesFileContents,
  setup,
} from '../test-utils';
import { entryCorePropertiesFilePath } from '../utils';
import { readDatabaseEntryCoreProperties } from './readDatabaseEntryCoreProperties';

describe('readDatabaseEntryCoreProperties', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the entry core properties from the file system', async () => {
    const coreProperties = await readDatabaseEntryCoreProperties(
      objectEntry1.path,
      objectDatabase,
    );

    expect(coreProperties).toEqual(
      Properties.fromYaml(
        objectDatabase.properties,
        objectEntry1CorePropertiesFileContents,
      ),
    );
  });

  it('creates a new entry core properties file if one does not exist', async () => {
    // Remove the file before reading to ensure it doesn't exist
    await Fs.removeFile(entryCorePropertiesFilePath(objectEntry1.path));

    const coreProperties = await readDatabaseEntryCoreProperties(
      objectEntry1.path,
      objectDatabase,
    );

    expect(coreProperties).toEqual({
      id: expect.any(String),
      title: objectDatabase.name,
      created: expect.any(Date),
      lastModified: expect.any(Date),
    });
  });
});
