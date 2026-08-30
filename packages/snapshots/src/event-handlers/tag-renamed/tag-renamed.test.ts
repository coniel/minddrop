import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { cleanup, setup } from '../../test-utils';
import { readRenameEvents } from '../../utils';
import { onTagRenamed } from './tag-renamed';

const { tag_1 } = TagFixtures;

describe('onTagRenamed', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('records the rename in the rename ledger', async () => {
    await onTagRenamed({
      original: tag_1,
      updated: { ...tag_1, name: 'Renamed Tag' },
    });

    // The ledger should contain a tag rename event recording the
    // old and new names and the tag's ID
    expect(await readRenameEvents()).toEqual([
      expect.objectContaining({
        from: tag_1.name,
        to: 'Renamed Tag',
        kind: 'tag',
        entityId: tag_1.id,
      }),
    ]);
  });
});
