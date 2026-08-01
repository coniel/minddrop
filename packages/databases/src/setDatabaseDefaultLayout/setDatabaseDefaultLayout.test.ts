import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, LayoutNotFoundError } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseDefaultLayout } from './setDatabaseDefaultLayout';

const { layout_card_1, layout_card_2, layout_page_1, design_books } =
  DesignFixtures;

describe('setDatabaseDefaultLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout is not part of the database design', async () => {
    // layout_card_1 does not belong to objectDatabase's design
    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_1.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the layout is not of the context base type', async () => {
    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'list', layout_card_2.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws when pinning a card layout to a page-based context', async () => {
    // design_books has one layout of each type
    DatabasesStore.update(objectDatabase.id, { designId: design_books.id });

    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'dialog', layout_card_1.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the database has no design', async () => {
    // Clear the database's design assignment
    DatabasesStore.update(objectDatabase.id, { designId: null });

    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_2.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('pins the layout as the default for the context', async () => {
    await setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_2.id);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultLayouts.card).toBe(
      layout_card_2.id,
    );
  });

  it('pins a page layout for a page-based context', async () => {
    DatabasesStore.update(objectDatabase.id, { designId: design_books.id });

    await setDatabaseDefaultLayout(
      objectDatabase.id,
      'dialog',
      layout_page_1.id,
    );

    expect(DatabasesStore.get(objectDatabase.id)?.defaultLayouts.dialog).toBe(
      layout_page_1.id,
    );
  });

  it('returns the updated database', async () => {
    const updated = await setDatabaseDefaultLayout(
      objectDatabase.id,
      'card',
      layout_card_2.id,
    );

    expect(updated.defaultLayouts.card).toBe(layout_card_2.id);
  });
});
