import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { DesignUpdatedEvent } from '../events';
import { MockFs, cardDesign_1, cleanup, mockDate, setup } from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { updateDesign } from './updateDesign';

describe('updateDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the updated design', async () => {
    const updated = await updateDesign(cardDesign_1.id, { name: 'Renamed' });

    expect(updated.name).toBe('Renamed');
  });

  it('updates the design in the store, bumping its modified date', async () => {
    await updateDesign(cardDesign_1.id, { name: 'Renamed' });

    expect(DesignsStore.get(cardDesign_1.id)).toEqual({
      ...cardDesign_1,
      name: 'Renamed',
      lastModified: mockDate,
    });
  });

  it('writes the updated design to the file system', async () => {
    await updateDesign(cardDesign_1.id, { name: 'Renamed' });

    expect(MockFs.readJsonFile(resolveDesignFilePath(cardDesign_1.id))).toEqual(
      { ...cardDesign_1, name: 'Renamed', lastModified: mockDate },
    );
  });

  it('throws if the design does not exist', async () => {
    await expect(() =>
      updateDesign('design_missing', { name: 'Renamed' }),
    ).rejects.toThrow(DesignNotFoundError);
  });

  it('dispatches the design updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignUpdatedEvent,
        'test-design-updated',
        (payload) => {
          expect(payload.data.original).toEqual(cardDesign_1);
          expect(payload.data.updated.name).toBe('Renamed');
          done();
        },
      );

      updateDesign(cardDesign_1.id, { name: 'Renamed' });
    }));
});
