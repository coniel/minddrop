import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { cleanup, objectDatabase, setup } from '../test-utils';
import type { Database } from '../types';
import { loadDatabaseDesigns } from './loadDatabaseDesigns';

const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;

// The designs as stored on a database config, without their owner
const { owner: _cardOwner, ...storedCardDesign } = ownedCardDesign_1;
const { owner: _listOwner, ...storedListDesign } = ownedListDesign_1;

describe('loadDatabaseDesigns', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads database designs into the designs store with the database as owner', () => {
    const database: Database = {
      ...objectDatabase,
      designs: [storedCardDesign],
    };

    loadDatabaseDesigns([database]);

    expect(Designs.get(ownedCardDesign_1.id)).toEqual({
      ...storedCardDesign,
      owner: objectDatabase.id,
    });
  });

  it('does nothing when databases have no designs', () => {
    loadDatabaseDesigns([objectDatabase]);

    expect(Designs.Store.getAllArray()).toHaveLength(0);
  });

  it('loads designs from multiple databases', () => {
    const database1: Database = {
      ...objectDatabase,
      id: 'database_1',
      designs: [storedCardDesign],
    };
    const database2: Database = {
      ...objectDatabase,
      id: 'database_2',
      designs: [storedListDesign],
    };

    loadDatabaseDesigns([database1, database2]);

    expect(Designs.getByOwner('database_1')).toHaveLength(1);
    expect(Designs.getByOwner('database_2')).toHaveLength(1);
  });
});
