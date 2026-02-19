import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { filterValidDatabaseFiles } from './filterValidDatabaseFiles';

const pdfFile = {
  name: 'file.pdf',
} as File;

const imageFile = {
  name: 'image.png',
} as File;

describe('filterValidDatabaseFiles', () => {
  beforeEach(() => setup({ loadDatabases: false }));

  afterEach(cleanup);

  it('returns all files as invalid if the database has no file based props', () => {
    DatabasesStore.add({
      ...objectDatabase,
      properties: [],
    });

    const { validFiles, invalidFiles } = filterValidDatabaseFiles(
      objectDatabase.id,
      [pdfFile, imageFile],
    );

    expect(validFiles).toEqual([]);
    expect(invalidFiles).toEqual([pdfFile, imageFile]);
  });

  it('returns all files as valid if the database has a generic file prop', () => {
    DatabasesStore.add({
      ...objectDatabase,
      properties: [
        {
          type: 'file',
          name: 'File',
        },
      ],
    });

    const { validFiles, invalidFiles } = filterValidDatabaseFiles(
      objectDatabase.id,
      [pdfFile, imageFile],
    );

    expect(validFiles).toEqual([pdfFile, imageFile]);
    expect(invalidFiles).toEqual([]);
  });

  it('retuns valid files if the database has non-generic file props', () => {
    DatabasesStore.add({
      ...objectDatabase,
      properties: [
        {
          type: 'image',
          name: 'Image',
        },
      ],
    });

    const { validFiles, invalidFiles } = filterValidDatabaseFiles(
      objectDatabase.id,
      [pdfFile, imageFile],
    );

    expect(validFiles).toEqual([imageFile]);
    expect(invalidFiles).toEqual([pdfFile]);
  });
});
