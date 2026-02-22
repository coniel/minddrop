import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { DatabasesStore } from '../DatabasesStore';
import {
  cleanup,
  defaultCardDesign,
  firstCardDesign,
  objectDatabase,
  setup,
} from '../test-utils';
import { getDefaultDatabaseDesign } from './getDefaultDatabaseDesign';

const { design_list_1 } = DesignFixtures;

describe('getDefaultDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the design configured as the default for the specified type', () => {
    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(defaultCardDesign);
  });

  it('returns the first available design if the database has no default design for the specified type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {},
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(firstCardDesign);
  });

  it('returns the global default design if the database does not have a design for the specified type', () => {
    // Remove all design associations from the test database
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {},
      designPropertyMaps: {},
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(Designs.get('card'));
  });

  it('handles default design which does not exist', () => {
    // Set a non-existent design as the default card design
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {
        card: 'missing-design',
      },
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(firstCardDesign);
  });

  it('handles default design being of the wrong type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {
        // Set a non-card design as the default card design
        card: design_list_1.id,
      },
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(firstCardDesign);
  });
});
