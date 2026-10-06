import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  DatabaseFixtures,
  cleanup,
  cleanupTestSqlDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { sqlUpsertDatabase } from '../sqlUpsertDatabase';
import { sqlUpsertEntries } from '../sqlUpsertEntries';
import { sqlGetReferencesToEntry } from './sqlGetReferencesToEntry';

const {
  collectionDatabase,
  collectionEntry1SqlRecord,
  objectDatabase,
  objectEntry1ContentPropertyRecord,
  objectEntry1SqlRecord,
  relatedEntry1,
  relatedEntry2,
  relatedPropertyName,
} = DatabaseFixtures;

const { workspace_2 } = WorkspaceFixtures;

// The references a wikilink to the first related entry can be
// written as.
const relatedEntry1References = [
  relatedEntry1.title,
  `${collectionDatabase.name}/${relatedEntry1.title}`,
];

describe('sqlGetReferencesToEntry', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the databases the entries belong to
    sqlUpsertDatabase(objectDatabase, { silent: true });
    sqlUpsertDatabase(collectionDatabase, { silent: true });
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it("returns the collection values containing the entry's ID", async () => {
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, relatedEntry1References),
    ).toEqual([
      {
        kind: 'property',
        entryId: collectionEntry1SqlRecord.id,
        propertyName: relatedPropertyName,
        targetEntryId: relatedEntry1.id,
      },
    ]);
  });

  it('returns the wikilinks written as any of the references', async () => {
    const titleLink = generateLinkingEntrySqlRecord(
      'title',
      `[[${relatedEntry1.title}]]`,
    );
    const addressLink = generateLinkingEntrySqlRecord(
      'address',
      `[[${collectionDatabase.name}/${relatedEntry1.title}]]`,
    );

    sqlUpsertEntries(objectDatabase.id, [titleLink, addressLink], {
      silent: true,
    });

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, relatedEntry1References),
    ).toEqual([
      {
        kind: 'wikilink',
        entryId: titleLink.id,
        reference: relatedEntry1.title,
      },
      {
        kind: 'wikilink',
        entryId: addressLink.id,
        reference: `${collectionDatabase.name}/${relatedEntry1.title}`,
      },
    ]);
  });

  it('returns each occurrence of a repeated wikilink', async () => {
    const link = generateLinkingEntrySqlRecord(
      'repeated',
      `[[${relatedEntry1.title}]] and again [[${relatedEntry1.title}]]`,
    );

    sqlUpsertEntries(objectDatabase.id, [link], { silent: true });

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, relatedEntry1References),
    ).toEqual([
      { kind: 'wikilink', entryId: link.id, reference: relatedEntry1.title },
      { kind: 'wikilink', entryId: link.id, reference: relatedEntry1.title },
    ]);
  });

  it("returns a wikilink's fragment", async () => {
    const link = generateLinkingEntrySqlRecord(
      'fragment',
      `[[${relatedEntry1.title}#^abcd]]`,
    );

    sqlUpsertEntries(objectDatabase.id, [link], { silent: true });

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, relatedEntry1References),
    ).toEqual([
      {
        kind: 'wikilink',
        entryId: link.id,
        reference: relatedEntry1.title,
        fragment: '^abcd',
      },
    ]);
  });

  it('matches wikilinks regardless of case, beyond ASCII', async () => {
    const link = generateLinkingEntrySqlRecord('case', '[[äpfel]]');

    sqlUpsertEntries(objectDatabase.id, [link], { silent: true });

    expect(await sqlGetReferencesToEntry(relatedEntry1.id, ['Äpfel'])).toEqual([
      { kind: 'wikilink', entryId: link.id, reference: 'äpfel' },
    ]);
  });

  it('leaves out wikilinks to other entries', async () => {
    sqlUpsertEntries(
      objectDatabase.id,
      [generateLinkingEntrySqlRecord('other', `[[${relatedEntry2.title}]]`)],
      { silent: true },
    );

    expect(
      await sqlGetReferencesToEntry(relatedEntry1.id, relatedEntry1References),
    ).toEqual([]);
  });

  it('reads the references in the given workspace', async () => {
    // Open the second workspace's database and index a link in it
    setupTestSqlDatabase(workspace_2.id);
    sqlUpsertDatabase(objectDatabase, { silent: true }, workspace_2.id);

    const link = generateLinkingEntrySqlRecord(
      'workspace',
      `[[${relatedEntry1.title}]]`,
    );

    sqlUpsertEntries(
      objectDatabase.id,
      [link],
      { silent: true },
      workspace_2.id,
    );

    expect(
      await sqlGetReferencesToEntry(
        relatedEntry1.id,
        relatedEntry1References,
        workspace_2.id,
      ),
    ).toEqual([
      { kind: 'wikilink', entryId: link.id, reference: relatedEntry1.title },
    ]);
  });
});

/**
 * Generates the SQL record of an object database entry with the given
 * markdown as its content.
 *
 * @param name - The entry's title, which also distinguishes its ID and path.
 * @param content - The entry's markdown content.
 * @returns The entry's SQL record.
 */
function generateLinkingEntrySqlRecord(
  name: string,
  content: string,
): SqlEntryRecord {
  return {
    ...objectEntry1SqlRecord,
    id: `${objectEntry1SqlRecord.id}_${name}`,
    path: `${name}.md`,
    title: name,
    properties: [{ ...objectEntry1ContentPropertyRecord, value: content }],
  };
}
