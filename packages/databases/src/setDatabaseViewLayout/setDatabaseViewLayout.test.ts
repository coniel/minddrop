import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, LayoutNotFoundError } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { setDatabaseViewLayout } from './setDatabaseViewLayout';

const { layout_card_1, layout_card_2, layout_card_3 } = DesignFixtures;

describe('setDatabaseViewLayout', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the layout is not part of the database design', async () => {
    // layout_card_1 does not belong to objectDatabase's design
    await expect(() =>
      setDatabaseViewLayout(objectDatabase.id, 'view-1', layout_card_1.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('throws if the database has no design', async () => {
    // Clear the database's design assignment
    DatabasesStore.update(objectDatabase.id, { designId: null });

    await expect(() =>
      setDatabaseViewLayout(objectDatabase.id, 'view-1', layout_card_2.id),
    ).rejects.toThrow(LayoutNotFoundError);
  });

  it('sets the view layout override, preserving existing ones', async () => {
    // Set a view layout override
    await setDatabaseViewLayout(objectDatabase.id, 'view-1', layout_card_2.id);

    // Set a second view layout override
    await setDatabaseViewLayout(objectDatabase.id, 'view-2', layout_card_3.id);

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.viewLayouts).toEqual({
      'view-1': layout_card_2.id,
      'view-2': layout_card_3.id,
    });
  });

  it('returns the updated database', async () => {
    const result = await setDatabaseViewLayout(
      objectDatabase.id,
      'view-1',
      layout_card_2.id,
    );

    expect(result.viewLayouts).toEqual({
      'view-1': layout_card_2.id,
    });
  });
});
