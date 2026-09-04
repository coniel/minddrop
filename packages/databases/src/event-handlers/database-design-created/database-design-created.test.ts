import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { onDatabaseDesignCreated } from './database-design-created';

const { ownedCardDesign_1, cardDesign_1 } = DesignFixtures;

describe('onDatabaseDesignCreated', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('persists the design to the database config', () => {
    const design = { ...ownedCardDesign_1, owner: objectDatabase.id };

    // Load the design into the store (simulates what happens
    // before the event fires).
    Designs.load([design]);

    onDatabaseDesignCreated(design);

    const designs = DatabasesStore.get(objectDatabase.id)?.designs;

    expect(designs).toHaveLength(1);
    expect(designs?.[0].id).toBe(ownedCardDesign_1.id);
  });

  it('ignores designs not owned by a database', () => {
    onDatabaseDesignCreated(cardDesign_1);

    expect(DatabasesStore.get(objectDatabase.id)?.designs).toBeUndefined();
  });
});
