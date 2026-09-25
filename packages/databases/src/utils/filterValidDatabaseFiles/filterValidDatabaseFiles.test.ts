import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  objectDatabase,
  pdfPropertyName,
  setup,
  validPdfPropertyFile,
} from '../../test-utils';
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
    DatabasesStore.set({
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
    DatabasesStore.set({
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

  it('accepts pdf files when the database has a pdf prop', () => {
    DatabasesStore.set({
      ...objectDatabase,
      properties: [
        {
          type: 'pdf',
          name: pdfPropertyName,
        },
      ],
    });

    const { validFiles, invalidFiles } = filterValidDatabaseFiles(
      objectDatabase.id,
      [validPdfPropertyFile, imageFile],
    );

    expect(validFiles).toEqual([validPdfPropertyFile]);
    expect(invalidFiles).toEqual([imageFile]);
  });

  it('retuns valid files if the database has non-generic file props', () => {
    DatabasesStore.set({
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
