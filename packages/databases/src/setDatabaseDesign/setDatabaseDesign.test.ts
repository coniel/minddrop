import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignNotFoundError } from '@minddrop/designs';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { updateDatabase } from '../updateDatabase';
import { setDatabaseDesign } from './setDatabaseDesign';

const { design_books, design_cards } = DesignFixtures;

describe('setDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database does not exist', async () => {
    await expect(() =>
      setDatabaseDesign('non-existent-db', design_books.id),
    ).rejects.toThrow(DatabaseNotFoundError);
  });

  it('throws if a non-null designId points to a missing design', async () => {
    await expect(() =>
      setDatabaseDesign(objectDatabase.id, 'missing-design'),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('assigns the new designId', async () => {
    await setDatabaseDesign(objectDatabase.id, design_books.id);

    expect(DatabasesStore.get(objectDatabase.id)?.designId).toBe(
      design_books.id,
    );
  });

  it('clears the design property map when the design changes', async () => {
    // Seed a non-empty map
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Heading' },
    });

    await setDatabaseDesign(objectDatabase.id, design_books.id);

    expect(DatabasesStore.get(objectDatabase.id)?.designPropertyMap).toEqual(
      {},
    );
  });

  it('clears defaultLayouts when the design changes', async () => {
    // objectDatabase has defaultLayouts.card pointing to a layout in
    // its current design; switching designs should clear it
    await setDatabaseDesign(objectDatabase.id, design_books.id);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultLayouts).toEqual({});
  });

  it('clears defaultLayouts and the map when unassigning the design', async () => {
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Heading' },
    });

    await setDatabaseDesign(objectDatabase.id, null);

    const updated = DatabasesStore.get(objectDatabase.id);

    expect(updated?.designId).toBeNull();
    expect(updated?.designPropertyMap).toEqual({});
    expect(updated?.defaultLayouts).toEqual({});
  });

  it('is a no-op when the designId is unchanged', async () => {
    // Seed a designPropertyMap that should be preserved
    await updateDatabase(objectDatabase.id, {
      designPropertyMap: { Title: 'Heading' },
    });

    await setDatabaseDesign(objectDatabase.id, design_cards.id);

    // Property map untouched because no actual change happened
    expect(DatabasesStore.get(objectDatabase.id)?.designPropertyMap).toEqual({
      Title: 'Heading',
    });
  });
});
