import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignNotFoundError } from '../errors';
import { DesignDeletedEvent } from '../events';
import {
  MockFs,
  cardDesign_1,
  cleanup,
  ownedCardDesign_1,
  setup,
} from '../test-utils';
import { resolveDesignFilePath } from '../utils';
import { deleteDesign } from './deleteDesign';

describe('deleteDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the design from the store', async () => {
    await deleteDesign(cardDesign_1.id);

    expect(DesignsStore.get(cardDesign_1.id)).toBeNull();
  });

  it('removes the design file', async () => {
    await deleteDesign(cardDesign_1.id);

    expect(MockFs.exists(resolveDesignFilePath(cardDesign_1.id))).toBe(false);
  });

  it('removes owned designs from the store', async () => {
    await deleteDesign(ownedCardDesign_1.id);

    expect(DesignsStore.get(ownedCardDesign_1.id)).toBeNull();
  });

  it('throws if the design does not exist', async () => {
    await expect(() => deleteDesign('design_missing')).rejects.toThrow(
      DesignNotFoundError,
    );
  });

  it('dispatches the design deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignDeletedEvent,
        'test-design-deleted',
        (payload) => {
          expect(payload).toEqual(cardDesign_1);
          done();
        },
      );

      deleteDesign(cardDesign_1.id);
    }));
});
