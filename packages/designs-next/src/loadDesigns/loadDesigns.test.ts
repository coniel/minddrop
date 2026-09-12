import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { cardDesign_1, cleanup, ownedCardDesign_1, setup } from '../test-utils';
import { loadDesigns } from './loadDesigns';

const { workspace_1, workspace_2 } = WorkspaceFixtures;
const designs = [cardDesign_1, ownedCardDesign_1];

describe('loadDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads owned and unowned designs into the store', () => {
    loadDesigns(designs, workspace_1.id);

    expect(DesignsStore).toHaveItem(cardDesign_1.id, cardDesign_1);
    expect(DesignsStore).toHaveItem(ownedCardDesign_1.id, ownedCardDesign_1);
  });

  it("loads the designs into the workspace's store record", () => {
    loadDesigns(designs, workspace_2.id);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(DesignsStore.in(workspace_2.id).get(cardDesign_1.id)).toEqual(
      cardDesign_1,
    );
    expect(DesignsStore).not.toHaveItem(cardDesign_1.id);
  });

  it('dispatches the designs loaded event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload).toEqual(designs);
          done();
        },
      );

      loadDesigns(designs, workspace_1.id);
    }));
});
