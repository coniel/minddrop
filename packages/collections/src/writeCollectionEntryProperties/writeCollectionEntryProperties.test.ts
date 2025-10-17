import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import {
  cleanup,
  notesCollectionPath,
  notesPropertiesDir,
  setup,
} from '../test-utils';
import { writeCollectionEntryProperties } from './writeCollectionEntryProperties';

const MockFs = initializeMockFileSystem([notesPropertiesDir]);

describe('writeCollectionEntryProperties', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('writes the entry properties to the properties file', async () => {
    const entryTitle = 'Test Note';
    const properties = {
      title: 'Test Note',
      note: 'This is a test note.',
    };

    await writeCollectionEntryProperties(
      notesCollectionPath,
      entryTitle,
      properties,
    );

    const propertiesFilePath = Fs.concatPath(
      notesPropertiesDir,
      `${entryTitle}.json`,
    );

    const writtenPropertiesText = MockFs.readTextFile(propertiesFilePath);
    const writtenProperties = JSON.parse(writtenPropertiesText);

    expect(writtenProperties).toEqual(properties);
  });
});
