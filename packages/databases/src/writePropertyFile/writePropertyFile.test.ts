import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import {
  MockFs,
  cleanup,
  commonStorageDatabase,
  commonStorageEntry1,
  entryStorageDatabase,
  entryStorageEntry1,
  imagePropertyName,
  propertyStorageDatabase,
  propertyStorageEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  setup,
} from '../test-utils';
import { writePropertyFile } from './writePropertyFile';

const file: File = new File([], 'write-prop-file-test-image.png');

describe('writePropertyFile', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('root based storage', () => {
    it('writes the file to the root database directory', async () => {
      await writePropertyFile(rootStorageEntry1.id, imagePropertyName, file);

      expect(
        MockFs.exists(Fs.concatPath(rootStorageDatabase.path, file.name)),
      ).toBe(true);
    });
  });

  describe('common based storage', () => {
    it('writes the file to the common directory', async () => {
      await writePropertyFile(commonStorageEntry1.id, imagePropertyName, file);

      expect(
        MockFs.exists(
          Fs.concatPath(
            commonStorageDatabase.path,
            commonStorageDatabase.propertyFilesDir!,
            file.name,
          ),
        ),
      ).toBe(true);
    });

    it('creates the common directory if it does not exist', async () => {
      // Remove the common directory
      MockFs.removeDir(
        Fs.concatPath(
          commonStorageDatabase.path,
          commonStorageDatabase.propertyFilesDir!,
        ),
      );

      await writePropertyFile(commonStorageEntry1.id, imagePropertyName, file);

      expect(
        MockFs.exists(
          Fs.concatPath(
            commonStorageDatabase.path,
            commonStorageDatabase.propertyFilesDir!,
          ),
        ),
      ).toBe(true);
    });
  });

  describe('property based storage', () => {
    it('writes the file to the property directory', async () => {
      await writePropertyFile(
        propertyStorageEntry1.id,
        imagePropertyName,
        file,
      );

      expect(
        MockFs.exists(
          Fs.concatPath(
            propertyStorageDatabase.path,
            imagePropertyName,
            file.name,
          ),
        ),
      ).toBe(true);
    });

    it('creates the property directory if it does not exist', async () => {
      // Remove the property directory
      MockFs.removeDir(
        Fs.concatPath(propertyStorageDatabase.path, imagePropertyName),
      );

      await writePropertyFile(
        propertyStorageEntry1.id,
        imagePropertyName,
        file,
      );

      expect(
        MockFs.exists(
          Fs.concatPath(propertyStorageDatabase.path, imagePropertyName),
        ),
      ).toBe(true);
    });
  });

  describe('entry based storage', () => {
    it('writes the file to the entry directory', async () => {
      await writePropertyFile(entryStorageEntry1.id, imagePropertyName, file);

      expect(
        MockFs.exists(
          Fs.concatPath(
            entryStorageDatabase.path,
            entryStorageEntry1.title,
            file.name,
          ),
        ),
      ).toBe(true);
    });

    it('throws if the entry directory does not exist', async () => {
      // Remove the entry directory
      MockFs.removeDir(Fs.parentDirPath(entryStorageEntry1.path));

      await expect(async () =>
        writePropertyFile(entryStorageEntry1.id, imagePropertyName, file),
      ).rejects.toThrow(InvalidParameterError);
    });
  });

  it('handles file name conflicts', async () => {
    // Add a file with the same name as the target file
    MockFs.addFiles([Fs.concatPath(rootStorageDatabase.path, file.name)]);

    const path = await writePropertyFile(
      rootStorageEntry1.id,
      imagePropertyName,
      file,
    );

    expect(path).toBe(
      Fs.concatPath(
        rootStorageDatabase.path,
        Fs.setPathIncrement(file.name, 1),
      ),
    );
  });
});
