import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import {
  DesignFixtures,
  MockFs,
  cleanup,
  mockDate,
  setup,
} from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { updateDesign } from './updateDesign';

const { design_books, design_space_virtual } = DesignFixtures;

describe('updateDesign', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('updates the design and bumps its last modified date', async () => {
    const updated = await updateDesign(design_books.id, { name: 'Novels' });

    expect(updated.name).toBe('Novels');
    expect(updated.lastModified).toEqual(mockDate);
    expect(DesignsStore.get(design_books.id)).toEqual(updated);
  });

  it('writes bundle-backed designs to the file system', async () => {
    // Remove the design file written by the fixture setup
    MockFs.clear();

    await updateDesign(design_books.id, { name: 'Novels' });

    expect(MockFs.exists(resolveDesignFilePath(design_books.id))).toBe(true);
  });

  it('does not write virtual designs to the file system', async () => {
    // Load the virtual design into the store
    DesignsStore.set(design_space_virtual);

    await updateDesign(design_space_virtual.id, { name: 'Renamed' });

    expect(MockFs.exists(resolveDesignFilePath(design_space_virtual.id))).toBe(
      false,
    );
  });

  it('dispatches a design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignUpdatedEventData>(
        DesignUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original.name).toBe(design_books.name);
          expect(payload.data.updated.name).toBe('Novels');
          done();
        },
      );

      updateDesign(design_books.id, { name: 'Novels' });
    }));
});
