import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Ledgers } from '@minddrop/history';
import { TagDeletedEvent, TagRenamedEvent } from '../events';
import { TagFixtures, cleanup, setup } from '../test-utils';
import { resolveWorkspaceTagLedger } from '../utils';
import { initializeTagEventHandlers } from './initializeTagEventHandlers';

const { tag_1, historyAction_tagRenamed, historyAction_tagDeleted } =
  TagFixtures;

describe('initializeTagEventHandlers', () => {
  beforeEach(() => {
    setup();

    // Register the tag event handlers
    initializeTagEventHandlers();
  });

  afterEach(cleanup);

  it('records the ledger when a tag is renamed', async () => {
    // Dispatch a tag rename
    Events.dispatch(TagRenamedEvent, {
      original: tag_1,
      updated: { ...tag_1, name: 'Renamed Tag' },
      action: historyAction_tagRenamed,
    });

    // Wait for the ledger to record the rename. The dispatch does not
    // await its listeners.
    await vi.waitFor(async () => {
      expect(await Ledgers.read(resolveWorkspaceTagLedger())).toEqual([
        expect.objectContaining({ kind: 'rename' }),
      ]);
    });
  });

  it('records the ledger when a tag is deleted', async () => {
    // Dispatch a tag deletion
    Events.dispatch(TagDeletedEvent, {
      ...tag_1,
      action: historyAction_tagDeleted,
    });

    // Wait for the ledger to record the deletion. The dispatch does not
    // await its listeners.
    await vi.waitFor(async () => {
      expect(await Ledgers.read(resolveWorkspaceTagLedger())).toEqual([
        expect.objectContaining({ kind: 'deleted' }),
      ]);
    });
  });
});
