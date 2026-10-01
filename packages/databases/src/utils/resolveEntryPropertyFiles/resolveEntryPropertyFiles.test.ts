import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import {
  cleanup,
  databaseDirPath,
  databaseEntry_pdf_1,
  database_pdf,
  entryStorageDatabase,
  entryStorageEntry1,
  genericFilePropertyName,
  imagePropertyName,
  pdfPropertyName,
  rootStorageDatabase,
  rootStorageEntry1,
  rootStorageEntry_empty_value,
  setup,
  validPdfPropertyFile,
} from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { resolveEntryPropertyFilePath } from '../resolveEntryPropertyFilePath';
import { resolveEntryPropertyFiles } from './resolveEntryPropertyFiles';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveEntryPropertyFiles', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the files of every file based property', () => {
    // Give the entry a value for its generic file property as well
    DatabaseEntriesStore.update(rootStorageEntry1.id, {
      properties: {
        ...rootStorageEntry1.properties,
        [genericFilePropertyName]: 'notes.txt',
      },
    });

    expect(resolveEntryPropertyFiles(rootStorageEntry1.id)).toEqual([
      {
        property: imagePropertyName,
        path: `${databaseDirPath(rootStorageDatabase)}/image.png`,
      },
      {
        property: genericFilePropertyName,
        path: `${databaseDirPath(rootStorageDatabase)}/notes.txt`,
      },
    ]);
  });

  it('restricts the files to the given property types', () => {
    DatabasesStore.set(database_pdf);
    DatabaseEntriesStore.set(databaseEntry_pdf_1);

    expect(
      resolveEntryPropertyFiles(databaseEntry_pdf_1.id, {
        propertyTypes: ['image'],
      }),
    ).toEqual([]);
    expect(
      resolveEntryPropertyFiles(databaseEntry_pdf_1.id, {
        propertyTypes: ['pdf'],
      }),
    ).toEqual([
      {
        property: pdfPropertyName,
        path: resolveEntryPropertyFilePath(
          databaseEntry_pdf_1.id,
          pdfPropertyName,
          validPdfPropertyFile.name,
        ),
      },
    ]);
  });

  it('skips properties without a file value', () => {
    // Give the entry an empty value for its generic file property
    DatabaseEntriesStore.update(rootStorageEntry1.id, {
      properties: {
        ...rootStorageEntry1.properties,
        [genericFilePropertyName]: '',
      },
    });

    expect(resolveEntryPropertyFiles(rootStorageEntry1.id)).toEqual([
      {
        property: imagePropertyName,
        path: `${databaseDirPath(rootStorageDatabase)}/image.png`,
      },
    ]);
    expect(resolveEntryPropertyFiles(rootStorageEntry_empty_value.id)).toEqual(
      [],
    );
  });

  it('resolves the files under the given workspace', () => {
    const files = resolveEntryPropertyFiles(rootStorageEntry1.id, {
      workspacePath: workspace_2.path,
    });

    expect(files).toHaveLength(1);
    expect(files[0].path.startsWith(`${workspace_2.path}/`)).toBe(true);
  });

  it('resolves the files of an entry given as an object', () => {
    // An entry which is not in the store
    const entry: DatabaseEntry = {
      ...entryStorageEntry1,
      id: 'database-entry_not-stored',
      title: 'Elsewhere',
    };

    expect(resolveEntryPropertyFiles(entry)).toEqual([
      {
        property: imagePropertyName,
        path: `${databaseDirPath(entryStorageDatabase)}/Elsewhere/image.png`,
      },
    ]);
  });
});
