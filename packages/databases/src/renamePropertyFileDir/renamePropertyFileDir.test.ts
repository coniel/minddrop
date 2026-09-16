import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  imagePropertyName,
  objectDatabase,
  propertyStorageDatabase,
  rootStorageDatabase,
  setup,
} from '../test-utils';
import { renamePropertyFileDir } from './renamePropertyFileDir';

// The image property, as declared before a rename
const imageProperty = propertyStorageDatabase.properties[0];
// The generic file property, which has no stored files
const fileProperty = propertyStorageDatabase.properties[1];
// A property whose values are not files
const contentProperty = objectDatabase.properties[0];

describe('renamePropertyFileDir', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("renames the property's directory", async () => {
    await renamePropertyFileDir(
      propertyStorageDatabase.id,
      imageProperty,
      'Cover',
    );

    // Resolve the database's directory path
    const databasePath = databaseDirPath(propertyStorageDatabase);

    // The property's files should have moved to the new directory
    expect(MockFs.exists(`${databasePath}/Cover/image.png`)).toBe(true);
    expect(MockFs.exists(`${databasePath}/${imagePropertyName}`)).toBe(false);
  });

  it('leaves a same-named directory alone under the other storage modes', async () => {
    // Resolve the database's directory path
    const databasePath = databaseDirPath(rootStorageDatabase);

    // A directory of the user's own which happens to share the
    // property's name.
    MockFs.addFiles([`${databasePath}/${imagePropertyName}/notes.md`]);

    await renamePropertyFileDir(
      rootStorageDatabase.id,
      rootStorageDatabase.properties[0],
      'Cover',
    );

    // Only property file storage names a directory after the property
    expect(MockFs.exists(`${databasePath}/${imagePropertyName}`)).toBe(true);
    expect(MockFs.exists(`${databasePath}/Cover`)).toBe(false);
  });

  it('throws if the property is not a file based property', async () => {
    await expect(
      renamePropertyFileDir(objectDatabase.id, contentProperty, 'Body'),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('does nothing when the property has stored no files', async () => {
    await renamePropertyFileDir(
      propertyStorageDatabase.id,
      fileProperty,
      'Attachment',
    );

    // No directory should have been created for the new name
    expect(
      MockFs.exists(`${databaseDirPath(propertyStorageDatabase)}/Attachment`),
    ).toBe(false);
  });
});
