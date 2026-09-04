import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { onDatabaseDesignDeleted } from './database-design-deleted';

const { ownedCardDesign_1, ownedListDesign_1, cardDesign_1 } = DesignFixtures;

const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };

describe('onDatabaseDesignDeleted', () => {
  beforeEach(() => {
    setup();

    // Load both designs, then remove the card design from the
    // store (simulates what happens before the event fires).
    Designs.load([cardDesign, listDesign]);
    Designs.Store.remove(cardDesign.id);
  });

  afterEach(cleanup);

  it('persists the remaining designs to the database config', async () => {
    await onDatabaseDesignDeleted(cardDesign);

    const designs = DatabasesStore.get(objectDatabase.id)?.designs;

    expect(designs).toHaveLength(1);
    expect(designs?.[0].id).toBe(listDesign.id);
  });

  it('unpins the deleted design from the default designs', async () => {
    // Pin the deleted design for the card context and the other
    // design for the list context.
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: { card: cardDesign.id, list: listDesign.id },
    });

    await onDatabaseDesignDeleted(cardDesign);

    expect(DatabasesStore.get(objectDatabase.id)?.defaultDesigns).toEqual({
      list: listDesign.id,
    });
  });

  it('ignores designs not owned by a database', async () => {
    await onDatabaseDesignDeleted(cardDesign_1);

    expect(DatabasesStore.get(objectDatabase.id)?.designs).toBeUndefined();
  });
});
