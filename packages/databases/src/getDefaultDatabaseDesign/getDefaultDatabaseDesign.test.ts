import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { i18n } from '@minddrop/i18n';
import { DatabasesStore } from '../DatabasesStore';
import { defaultCardDesign, defaultListDesign } from '../constants';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDefaultDatabaseDesign } from './getDefaultDatabaseDesign';

describe('getDefaultDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the default design for the specified database and type', () => {
    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(objectDatabase.designs[0]);
  });

  it('returns the first available design if the database has no default design for the specified type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {},
      designs: [
        {
          ...defaultCardDesign,
          id: 'design-1',
        },
        {
          ...defaultCardDesign,
          id: 'design-2',
        },
      ],
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design.id).toBe('design-1');
  });

  it('returns the global default design if the database does not have a design for the specified type', () => {
    // Remove the default designs from the test database
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {},
      designs: [],
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual({
      ...defaultCardDesign,
      name: i18n.t(defaultCardDesign.name),
    });
  });

  it('handles default design which does not exist', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {
        card: 'missing-design',
      },
      designs: [defaultCardDesign],
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(defaultCardDesign);
  });

  it('handles default design being of the wrong type', () => {
    DatabasesStore.update(objectDatabase.id, {
      defaultDesigns: {
        // Set a non-card design as the default card design
        card: defaultListDesign.id,
      },
      designs: [defaultListDesign, defaultCardDesign],
    });

    const design = getDefaultDatabaseDesign(objectDatabase.id, 'card');

    expect(design).toEqual(defaultCardDesign);
  });
});
