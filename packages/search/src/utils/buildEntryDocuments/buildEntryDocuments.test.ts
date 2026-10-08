import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  seedDatabase,
  setup,
  testWorkspaceId,
} from '../../test-utils';
import { buildEntryDocuments } from './buildEntryDocuments';

const workspaceId = testWorkspaceId;

// The databases as SQL lists them
const books = { id: 'database-1', name: 'Books', icon: 'book' };
const films = { id: 'database-2', name: 'Films', icon: 'film' };

// The entries as SQL lists them
const dune = { id: 'entry-1', title: 'Dune', databaseId: books.id };
const alien = { id: 'entry-2', title: 'Alien', databaseId: films.id };

describe('buildEntryDocuments', () => {
  beforeEach(() => {
    setup();

    // Seed the entries' databases
    seedDatabase(books);
    seedDatabase(films);
  });

  afterEach(cleanup);

  it("builds a document for each entry with its database's metadata", () => {
    const documents = buildEntryDocuments(
      workspaceId,
      [dune, alien],
      new Map(),
    );

    expect(documents).toEqual([
      {
        id: dune.id,
        type: 'entry',
        title: dune.title,
        databaseId: books.id,
        databaseName: books.name,
        databaseIcon: books.icon,
        properties: '',
        tags: '',
      },
      {
        id: alien.id,
        type: 'entry',
        title: alien.title,
        databaseId: films.id,
        databaseName: films.name,
        databaseIcon: films.icon,
        properties: '',
        tags: '',
      },
    ]);
  });

  it("joins each entry's property values", () => {
    const [document] = buildEntryDocuments(
      workspaceId,
      [dune],
      new Map([[dune.id, ['Frank Herbert', 'https://dune.com']]]),
    );

    expect(document.properties).toBe('Frank Herbert https://dune.com');
  });

  it('leaves the database metadata empty for an unknown database', () => {
    const [document] = buildEntryDocuments(
      workspaceId,
      [{ ...dune, databaseId: 'database-missing' }],
      new Map(),
    );

    expect(document.databaseName).toBe('');
    expect(document.databaseIcon).toBe('');
  });
});
