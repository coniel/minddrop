import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { cardDesign_1, cleanup, ownedCardDesign_1, setup } from '../test-utils';
import { loadDesigns } from './loadDesigns';

const designs = [cardDesign_1, ownedCardDesign_1];

describe('loadDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads owned and unowned designs into the store', () => {
    loadDesigns(designs);

    expect(DesignsStore.get(cardDesign_1.id)).toEqual(cardDesign_1);
    expect(DesignsStore.get(ownedCardDesign_1.id)).toEqual(ownedCardDesign_1);
  });

  it('dispatches the designs loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload.data).toEqual(designs);
          done();
        },
      );

      loadDesigns(designs);
    }));
});
