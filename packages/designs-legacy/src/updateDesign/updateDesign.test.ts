import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignUpdatedEvent, DesignUpdatedEventData } from '../events';
import { MockFs, cleanup, design_books, setup } from '../test-utils';
import { Design } from '../types';
import { resolveDesignFilePath } from '../utils';
import { updateDesign } from './updateDesign';

const lastModified = new Date('2000-01-01T00:00:00.000Z');
const update = { name: 'Books v2' };
const updatedDesign: Design = {
  ...design_books,
  ...update,
  lastModified,
};

describe('updateDesign', () => {
  beforeEach(() => {
    setup();
    vi.setSystemTime(lastModified);
  });

  afterEach(cleanup);

  it('returns the updated design', async () => {
    const result = await updateDesign(design_books.id, update);

    expect(result).toEqual(updatedDesign);
  });

  it('updates the design in the store', async () => {
    await updateDesign(design_books.id, update);

    expect(DesignsStore.get(design_books.id)).toEqual(updatedDesign);
  });

  it('writes the updated design to the file system', async () => {
    await updateDesign(design_books.id, update);

    expect(
      MockFs.readJsonFile<Design>(resolveDesignFilePath(design_books.id)),
    ).toEqual(updatedDesign);
  });

  it('dispatches a design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignUpdatedEventData>(
        DesignUpdatedEvent,
        'test',
        (payload) => {
          expect(payload.data.original).toEqual(design_books);
          expect(payload.data.updated).toEqual(updatedDesign);
          done();
        },
      );

      updateDesign(design_books.id, update);
    }));
});
