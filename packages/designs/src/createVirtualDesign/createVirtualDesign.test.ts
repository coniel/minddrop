import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignCreatedEvent } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { createVirtualDesign } from './createVirtualDesign';

describe('createVirtualDesign', () => {
  beforeEach(() => setup({ loadDesignFiles: false }));
  afterEach(cleanup);

  it('adds the virtual design to the store', () => {
    const design = createVirtualDesign({
      id: 'design_virtual-1',
      type: 'space',
      owner: 'space_owner-1',
      ownerKey: 'layout',
    });

    expect(DesignsStore.get(design.id)).toEqual(design);
    expect(design.virtual).toBe(true);
    expect(design.owner).toBe('space_owner-1');
    expect(design.ownerKey).toBe('layout');
  });

  it('seeds virtual database designs with an empty property schema', () => {
    const design = createVirtualDesign({
      id: 'design_virtual-2',
      type: 'database',
      owner: 'space_owner-1',
    });

    expect(design.type === 'database' && design.properties).toEqual([]);
  });

  it('writes nothing to the file system', () => {
    const design = createVirtualDesign({
      id: 'design_virtual-1',
      type: 'space',
      owner: 'space_owner-1',
    });

    expect(MockFs.exists(resolveDesignFilePath(design.id))).toBe(false);
  });

  it('dispatches a design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DesignCreatedEvent, 'test', (payload) => {
        expect(payload.virtual).toBe(true);
        done();
      });

      createVirtualDesign({
        id: 'design_virtual-1',
        type: 'space',
        owner: 'space_owner-1',
      });
    }));
});
