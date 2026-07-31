import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, LayoutNotFoundError } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseDefaultLayout } from './setDatabaseDefaultLayout';

const { layout_card_1, layout_card_2 } = DesignFixtures;

describe('setDatabaseDefaultLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout is not part of the database design', async () => {
    // layout_card_1 does not belong to objectDatabase's design
    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_1.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the layout is not of the given type', async () => {
    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'list', layout_card_2.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the database has no design', async () => {
    // Clear the database's design assignment
    DatabasesStore.update(objectDatabase.id, { designId: null });

    await expect(() =>
      setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_2.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('pins the layout as the default for its type', async () => {
    await setDatabaseDefaultLayout(objectDatabase.id, 'card', layout_card_2.id);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultLayouts.card).toBe(
      layout_card_2.id,
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
