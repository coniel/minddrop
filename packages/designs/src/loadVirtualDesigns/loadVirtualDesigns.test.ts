import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignsLoadedEvent } from '../events';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { loadVirtualDesigns } from './loadVirtualDesigns';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const { design_space_virtual_data } = DesignFixtures;

describe('loadVirtualDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false, loadDesignFiles: false }));
  afterEach(cleanup);

  it('loads the designs into the store with the virtual flag set', () => {
    const [design] = loadVirtualDesigns(
      [design_space_virtual_data],
      workspace_1.id,
    );

    expect(DesignsStore).toHaveItem(design.id, design);
    expect(design.virtual).toBe(true);
    expect(design.created).toBeInstanceOf(Date);
  });

  it("loads the designs into the workspace's store record", () => {
    const [design] = loadVirtualDesigns(
      [design_space_virtual_data],
      workspace_2.id,
    );

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(DesignsStore.in(workspace_2.id).get(design.id)).toEqual(design);
    expect(DesignsStore).not.toHaveItem(design.id);
  });

  it('dispatches a loaded event rather than created events', async () =>
    new Promise<void>((done) => {
      // Created events must not fire for hydrated designs
      const createdListener = vi.fn();
      Events.addListener(DesignCreatedEvent, 'test', createdListener);

      // Listen for the loaded event
      Events.addListener(DesignsLoadedEvent, 'test', (payload) => {
        expect(payload).toHaveLength(1);
        expect(createdListener).not.toHaveBeenCalled();
        done();
      });

      loadVirtualDesigns([design_space_virtual_data], workspace_1.id);
    }));
});
