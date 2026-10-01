import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Ledgers } from '@minddrop/history';
import { TagFixtures, cleanup, setup } from '../../test-utils';
import { resolveWorkspaceTagLedger } from '../../utils';
import { onTagDeleted } from './tag-deleted';

const { tag_1, historyAction_tagDeleted } = TagFixtures;

describe('onTagDeleted', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("records the deletion in the workspace's tags ledger", async () => {
    // Call the handler
    await onTagDeleted({ ...tag_1, action: historyAction_tagDeleted });

    // The ledger should record the deletion under the tag's name
    expect(await Ledgers.read(resolveWorkspaceTagLedger())).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: tag_1.name, id: tag_1.id },
        action: historyAction_tagDeleted,
      }),
    ]);
  });
});
