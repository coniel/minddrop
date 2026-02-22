import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignDeletedEvent, DesignDeletedEventData } from '../events';
import { MockFs, cleanup, design_card_1, setup } from '../test-utils';
import { deleteDesign } from './deleteDesign';

describe('deleteDesign', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the design file', async () => {
    await deleteDesign(design_card_1.id);

    expect(MockFs.exists(design_card_1.path)).toBe(false);
  });

  it('removes the design from the store', async () => {
    await deleteDesign(design_card_1.id);

    expect(DesignsStore.get(design_card_1.id)).toBeNull();
  });

  it('dispatches a design deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener<DesignDeletedEventData>(
        DesignDeletedEvent,
        'test',
        (payload) => {
          expect(payload.data).toEqual(design_card_1);
          done();
        },
      );

      deleteDesign(design_card_1.id);
    }));
});
