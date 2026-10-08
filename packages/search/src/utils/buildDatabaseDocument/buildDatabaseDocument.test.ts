import { describe, expect, it } from 'vitest';
import { buildDatabaseDocument } from './buildDatabaseDocument';

// A database as SQL lists it
const books = { id: 'database-1', name: 'Books', icon: 'book' };

describe('buildDatabaseDocument', () => {
  it("builds a document for the database under a 'db:' prefixed ID", () => {
    expect(buildDatabaseDocument(books)).toEqual({
      id: `db:${books.id}`,
      type: 'database',
      title: books.name,
      databaseId: books.id,
      databaseName: books.name,
      databaseIcon: books.icon,
      properties: '',
      tags: '',
    });
  });

  it('leaves the icon empty for a database without one', () => {
    expect(
      buildDatabaseDocument({ id: books.id, name: books.name }).databaseIcon,
    ).toBe('');
  });
});
