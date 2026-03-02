import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, mockDate, setup, view_gallery_1 } from '../test-utils';
import { setEntryDesign } from './setEntryDesign';

describe('setEntryDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the design for the specified entry in the view', async () => {
    // Set an entry design mapping
    const result = await setEntryDesign(
      view_gallery_1.id,
      'entry-1',
      'design-custom',
    );

    // Should contain the new mapping
    expect(result.entryDesignMap).toEqual({
      'entry-1': 'design-custom',
    });
  });

  it('preserves existing entry design mappings', async () => {
    // Set a first entry design mapping
    await setEntryDesign(view_gallery_1.id, 'entry-1', 'design-a');

    // Set a second entry design mapping
    const result = await setEntryDesign(
      view_gallery_1.id,
      'entry-2',
      'design-b',
    );

    // Should contain both mappings
    expect(result.entryDesignMap).toEqual({
      'entry-1': 'design-a',
      'entry-2': 'design-b',
    });
  });

  it('returns the updated view', async () => {
    // Set an entry design mapping
    const result = await setEntryDesign(
      view_gallery_1.id,
      'entry-1',
      'design-custom',
    );

    // Should return the updated view with new mapping and updated timestamp
    expect(result).toEqual({
      ...view_gallery_1,
      entryDesignMap: {
        'entry-1': 'design-custom',
      },
      lastModified: mockDate,
    });
  });
});
