import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { DesignDeletedEvent } from '../events';
import {
  MockFs,
  cardDesign_1,
  cleanup,
  ownedCardDesign_1,
  setup,
} from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { deleteDesign } from './deleteDesign';

const { workspace_2 } = WorkspaceFixtures;

describe('deleteDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the design from the store', async () => {
    await deleteDesign(cardDesign_1.id);

    expect(DesignsStore).not.toHaveItem(cardDesign_1.id);
  });

  it('removes the design file', async () => {
    await deleteDesign(cardDesign_1.id);

    expect(MockFs.exists(resolveDesignFilePath(cardDesign_1.id))).toBe(false);
  });

  it('removes owned designs from the store', async () => {
    await deleteDesign(ownedCardDesign_1.id);

    expect(DesignsStore).not.toHaveItem(ownedCardDesign_1.id);
  });

  it('deletes the design from the given workspace', async () => {
    const otherPath = resolveDesignFilePath(cardDesign_1.id, workspace_2.path);

    // A design held by the second workspace only
    DesignsStore.in(workspace_2.id).set(cardDesign_1);
    MockFs.addFiles([
      { path: otherPath, textContent: JSON.stringify(cardDesign_1) },
    ]);

    await deleteDesign(cardDesign_1.id, workspace_2.id);

    // Should remove the second workspace's design and file, leaving
    // the active workspace's as they were.
    expect(DesignsStore.in(workspace_2.id).get(cardDesign_1.id)).toBeNull();
    expect(MockFs.exists(otherPath)).toBe(false);
    expect(DesignsStore).toHaveItem(cardDesign_1.id);
    expect(MockFs.exists(resolveDesignFilePath(cardDesign_1.id))).toBe(true);
  });

  it('throws if the design does not exist', async () => {
    await expect(() => deleteDesign('design_missing')).rejects.toThrow(
      DesignNotFoundError,
    );
  });

  it('dispatches the design deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignDeletedEvent,
        'test-design-deleted',
        (payload) => {
          expect(payload).toEqual(cardDesign_1);
          done();
        },
      );

      deleteDesign(cardDesign_1.id);
    }));
});
