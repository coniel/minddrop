import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignsStore } from '../DesignsStore';
import { DefaultCardDesign } from '../default-designs';
import { MockFs, cleanup, design_card_1, setup } from '../test-utils';
import { getDesignFilePath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads default designs into the store', async () => {
    await initializeDesigns();

    expect(
      DesignsStore.getAll().find((design) => design.id === 'card'),
    ).toEqual(DefaultCardDesign);
  });

  it('loads designs from the file system and loads them into the store', async () => {
    await initializeDesigns();

    expect(DesignsStore.get(design_card_1.id)).toEqual(design_card_1);
  });

  it('handles failed design reads', async () => {
    // Add an invalid design file
    MockFs.writeTextFile(getDesignFilePath('invalid-design'), 'invalid json');

    await initializeDesigns();

    expect(
      DesignsStore.getAll().find((design) => !Boolean(design)),
    ).toBeUndefined();
  });
});
