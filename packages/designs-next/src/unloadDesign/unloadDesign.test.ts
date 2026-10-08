import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent } from '../events';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { unloadDesign } from './unloadDesign';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { cardDesign_1 } = DesignFixtures;

describe('unloadDesign', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('removes the design from the store', () => {
    unloadDesign(cardDesign_1.id);

    expect(DesignsStore).not.toHaveItem(cardDesign_1.id);
  });

  it("leaves the design's file in place", () => {
    unloadDesign(cardDesign_1.id);

    expect(
      MockFs.exists(resolveDesignFilePath(cardDesign_1.id, workspace_1.path)),
    ).toBe(true);
  });

  it('does not dispatch a design deleted event', async () => {
    // Record any design deleted event
    let dispatched = false;

    Events.on(DesignDeletedEvent, 'test', () => {
      dispatched = true;
    });

    unloadDesign(cardDesign_1.id);

    // Let any dispatched event reach its listeners
    await Events.tests.awaitAllListeners();

    expect(dispatched).toBe(false);
  });

  it("removes the design from the given workspace's record only", () => {
    // Add the design to the second workspace's record
    DesignsStore.in(workspace_2.id).set(cardDesign_1);

    unloadDesign(cardDesign_1.id, workspace_2.id);

    expect(DesignsStore.in(workspace_2.id).get(cardDesign_1.id)).toBeNull();
    expect(DesignsStore).toHaveItem(cardDesign_1.id);
  });
});
