import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignRolesStore } from '../DesignRolesStore';
import { DesignsStore } from '../DesignsStore';
import { BuiltInDesignRoles } from '../roles';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

const { workspace_1 } = WorkspaceFixtures;
const { design_books } = DesignFixtures;

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadRoles: false }));
  afterEach(cleanup);

  it('registers the built-in design roles', () => {
    initializeDesigns();

    expect(DesignRolesStore).toHaveItems(BuiltInDesignRoles);
  });

  it('applies design bundle changes made outside of the app', async () => {
    initializeDesigns();

    Events.dispatch(Fs.events.Changed, {
      workspaceId: workspace_1.id,
      path: resolveDesignFilePath(design_books.id),
      kind: 'deleted',
    });

    await flushEvents();

    expect(DesignsStore).not.toHaveItem(design_books.id);
  });
});

/**
 * Lets the queued event listeners run.
 */
async function flushEvents(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
}
