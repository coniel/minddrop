import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent, DesignsLoadedEvent } from '../events';
import { DesignFixtures, cleanup, setup } from '../test-utils';
import { loadVirtualDesigns } from './loadVirtualDesigns';

const { design_space_virtual_data } = DesignFixtures;

describe('loadVirtualDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false, loadDesignFiles: false }));
  afterEach(cleanup);

  it('loads the designs into the store with the virtual flag set', () => {
    const [design] = loadVirtualDesigns([design_space_virtual_data]);

    expect(DesignsStore.get(design.id)).toEqual(design);
    expect(design.virtual).toBe(true);
    expect(design.created).toBeInstanceOf(Date);
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

      loadVirtualDesigns([design_space_virtual_data]);
    }));
});
