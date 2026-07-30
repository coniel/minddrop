import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { clearDatabaseViewLayout } from './clearDatabaseViewLayout';

const { layout_card_1, layout_list_1 } = DesignFixtures;

describe('clearDatabaseViewLayout', () => {
  beforeEach(() => {
    setup();

    // Set up view layout overrides on the database
    DatabasesStore.update(objectDatabase.id, {
      viewLayouts: {
        'view-1': layout_card_1.id,
        'view-2': layout_list_1.id,
      },
    });
  });

  afterEach(cleanup);

  it('removes the view layout override from the database', async () => {
    await clearDatabaseViewLayout(objectDatabase.id, 'view-1');

    const database = DatabasesStore.get(objectDatabase.id)!;

    expect(database.viewLayouts).toEqual({
      'view-2': layout_list_1.id,
    });
  });

  it('returns the updated database', async () => {
    const result = await clearDatabaseViewLayout(objectDatabase.id, 'view-1');

    expect(result.viewLayouts).toEqual({
      'view-2': layout_list_1.id,
    });
  });
});
