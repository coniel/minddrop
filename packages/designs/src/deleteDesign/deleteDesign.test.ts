import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { DesignFixtures, MockFs, cleanup, setup } from '../test-utils';
import { resolveDesignBundleDirPath } from '../utils';
import { deleteDesign } from './deleteDesign';

const { design_books, design_space_virtual } = DesignFixtures;

describe('deleteDesign', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('removes the design from the store', async () => {
    await deleteDesign(design_books.id);

    expect(DesignsStore.get(design_books.id)).toBeNull();
  });

  it('deletes the design bundle directory', async () => {
    await deleteDesign(design_books.id);

    expect(MockFs.exists(resolveDesignBundleDirPath(design_books.id))).toBe(
      false,
    );
  });

  it('removes virtual designs without touching the file system', async () => {
    // Load the virtual design into the store
    DesignsStore.set(design_space_virtual);

    await deleteDesign(design_space_virtual.id);

    expect(DesignsStore.get(design_space_virtual.id)).toBeNull();
  });

  it('dispatches a design deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignDeletedEventData>(
        DesignDeletedEvent,
        'test',
        (payload) => {
          expect(payload.data.id).toBe(design_books.id);
          done();
        },
      );

      deleteDesign(design_books.id);
    }));
});
