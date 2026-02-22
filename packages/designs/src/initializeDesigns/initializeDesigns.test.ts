import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignsStore } from '../DesignsStore';
import { DesignFileExtension } from '../constants';
import {
  MockFs,
  cleanup,
  designs,
  designsRootPath,
  setup,
} from '../test-utils';
import { initializeDesigns } from './initializeDesigns';

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads designs from the file system and loads them into the store', async () => {
    await initializeDesigns();

    expect(DesignsStore.getAll()).toEqual(designs);
  });

  it('handles failed design reads', async () => {
    // Add an invalid design file
    MockFs.writeTextFile(
      `${designsRootPath}/Some design.${DesignFileExtension}`,
      'invalid json',
    );

    await initializeDesigns();

    expect(DesignsStore.getAll()).toEqual(designs);
  });
});
