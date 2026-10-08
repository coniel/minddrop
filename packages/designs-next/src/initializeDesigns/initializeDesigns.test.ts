import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { createFileSystemChange } from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

const { workspace_1 } = WorkspaceFixtures;
const { cardDesign_1 } = DesignFixtures;

describe('initializeDesigns', () => {
  beforeEach(() => setup());

  afterEach(cleanup);

  it('applies design file changes made outside of the app', async () => {
    initializeDesigns();

    // Resolve the design file's path
    const designPath = resolveDesignFilePath(cardDesign_1.id, workspace_1.path);
    // The design with a new name
    const modified = { ...cardDesign_1, name: 'Renamed design' };

    // Modify the design file outside of the app
    MockFs.writeTextFile(designPath, JSON.stringify(modified));

    // Report the change
    Events.dispatch(
      Fs.events.Changed,
      createFileSystemChange(designPath, 'modified', workspace_1.id),
    );

    // Let the change handler run
    await vi.advanceTimersByTimeAsync(0);

    expect(DesignsStore).toHaveItem(cardDesign_1.id, modified);
  });
});
