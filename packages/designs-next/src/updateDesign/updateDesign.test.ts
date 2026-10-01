import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { storeItem } from '@minddrop/stores/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { DesignUpdatedEvent } from '../events';
import {
  MockFs,
  cardDesign_1,
  cleanup,
  mockDate,
  ownedCardDesign_1,
  pageDesign_1,
  setup,
} from '../test-utils';
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

    expect(DesignsStore).toHaveItem(cardDesign_1.id, {
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

  it('updates owned designs without writing to the file system', async () => {
    await updateDesign(ownedCardDesign_1.id, { name: 'Renamed' });

    expect(storeItem(DesignsStore, ownedCardDesign_1.id).name).toBe('Renamed');
    expect(MockFs.exists(resolveDesignFilePath(ownedCardDesign_1.id))).toBe(
      false,
    );
  });

  it('sets the aspect ratio', async () => {
    await updateDesign(cardDesign_1.id, { aspectRatio: '3/2' });

    expect(storeItem(DesignsStore, cardDesign_1.id).aspectRatio).toBe('3/2');
  });

  it('drops the aspect ratio field when cleared', async () => {
    await updateDesign(cardDesign_1.id, { aspectRatio: '3/2' });
    await updateDesign(cardDesign_1.id, { aspectRatio: null });

    expect(DesignsStore.get(cardDesign_1.id)).not.toHaveProperty('aspectRatio');
  });

  it('sets the content width and side padding', async () => {
    await updateDesign(pageDesign_1.id, {
      contentWidth: 'narrow',
      sidePadding: 16,
    });

    const design = storeItem(DesignsStore, pageDesign_1.id);

    expect(design.contentWidth).toBe('narrow');
    expect(design.sidePadding).toBe(16);
  });

  it('drops the content width and side padding fields when cleared', async () => {
    await updateDesign(pageDesign_1.id, {
      contentWidth: 'narrow',
      sidePadding: 16,
    });
    await updateDesign(pageDesign_1.id, {
      contentWidth: null,
      sidePadding: null,
    });

    const design = storeItem(DesignsStore, pageDesign_1.id);

    expect(design).not.toHaveProperty('contentWidth');
    expect(design).not.toHaveProperty('sidePadding');
  });

  it('keeps the clearable fields on updates which leave them out', async () => {
    await updateDesign(pageDesign_1.id, {
      aspectRatio: '3/2',
      contentWidth: 'narrow',
      sidePadding: 16,
    });
    await updateDesign(pageDesign_1.id, { name: 'Renamed' });

    const design = storeItem(DesignsStore, pageDesign_1.id);

    expect(design.aspectRatio).toBe('3/2');
    expect(design.contentWidth).toBe('narrow');
    expect(design.sidePadding).toBe(16);
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
          expect(payload.original).toEqual(cardDesign_1);
          expect(payload.updated.name).toBe('Renamed');
          done();
        },
      );

      updateDesign(cardDesign_1.id, { name: 'Renamed' });
    }));
});
