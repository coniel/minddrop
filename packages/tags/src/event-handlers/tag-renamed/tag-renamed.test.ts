import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { TagFixtures, cleanup, setup } from '../../test-utils';
import { resolveWorkspaceTagLedger } from '../../utils';
import { onTagRenamed } from './tag-renamed';

const { tag_1, historyAction_tagRenamed } = TagFixtures;

// The first tag renamed
const renamedTag = { ...tag_1, name: 'Renamed Tag' };

describe('onTagRenamed', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the rename in the workspace's tags ledger under the old name", async () => {
    // Call the handler
    await onTagRenamed({
      original: tag_1,
      updated: renamedTag,
      action: historyAction_tagRenamed,
    });

    // The ledger should record the rename from the old name
    expect(await Ledgers.read(resolveWorkspaceTagLedger())).toEqual([
      expect.objectContaining({
        kind: 'rename',
        subject: { key: tag_1.name, id: tag_1.id },
        to: renamedTag.name,
        action: historyAction_tagRenamed,
      }),
    ]);
  });
});
