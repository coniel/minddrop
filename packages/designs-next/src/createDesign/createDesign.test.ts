import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DefaultDesignColumns, DefaultDesignRows } from '../constants';
import { DesignCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { createDesign } from './createDesign';

const newDesign = {
  id: expect.any(String),
  name: 'My design',
  type: 'card',
  columns: DefaultDesignColumns,
  rows: DefaultDesignRows,
  elements: [],
  created: mockDate,
  lastModified: mockDate,
};

describe('createDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a design', async () => {
    const design = await createDesign({ type: 'card', name: 'My design' });

    expect(design).toEqual(newDesign);
  });

  it("defaults the name to the design type's localized name", async () => {
    const design = await createDesign({ type: 'card' });

    expect(design.name).toBe('Card');
  });

  it('adds the design to the store', async () => {
    const design = await createDesign({ type: 'card', name: 'My design' });

    expect(DesignsStore).toHaveItem(design.id, newDesign);
  });

  it('writes the design to the file system', async () => {
    const design = await createDesign({ type: 'card', name: 'My design' });

    expect(MockFs.readJsonFile(resolveDesignFilePath(design.id))).toEqual(
      newDesign,
    );
  });

  it('records the owner on owned designs', async () => {
    const design = await createDesign({ type: 'card', owner: 'database_1' });

    expect(storeItem(DesignsStore, design.id).owner).toBe('database_1');
  });

  it('does not write owned designs to the file system', async () => {
    const design = await createDesign({ type: 'card', owner: 'database_1' });

    expect(MockFs.exists(resolveDesignFilePath(design.id))).toBe(false);
  });

  it('dispatches the design created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignCreatedEvent,
        'test-design-created',
        (payload) => {
          expect(payload).toEqual(newDesign);
          done();
        },
      );

      createDesign({ type: 'card', name: 'My design' });
    }));
});
