import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, mockDate, setup, view_gallery_1 } from '../test-utils';
import { setDatabaseDesign } from './setDatabaseDesign';

describe('setDatabaseDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the design for the specified database in the view', async () => {
    // Set a new database design mapping
    const result = await setDatabaseDesign(
      view_gallery_1.id,
      'database-new',
      'design-new',
    );

    // Should contain the new mapping merged with existing mappings
    expect(result.databaseDesignMap).toEqual({
      ...view_gallery_1.databaseDesignMap,
      'database-new': 'design-new',
    });
  });

  it('preserves existing database design mappings', async () => {
    // Set a new database design mapping
    const result = await setDatabaseDesign(
      view_gallery_1.id,
      'database-new',
      'design-new',
    );

    // Should still contain the original mapping
    expect(result.databaseDesignMap![view_gallery_1.dataSource.id]).toBe(
      'design-1',
    );
  });

  it('returns the updated view', async () => {
    // Set a new database design mapping
    const result = await setDatabaseDesign(
      view_gallery_1.id,
      'database-new',
      'design-new',
    );

    // Should return the updated view with new mapping and updated timestamp
    expect(result).toEqual({
      ...view_gallery_1,
      databaseDesignMap: {
        ...view_gallery_1.databaseDesignMap,
        'database-new': 'design-new',
      },
      lastModified: mockDate,
    });
  });
});
