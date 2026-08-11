import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignsStore } from '../DesignsStore';
import {
  MockFs,
  cleanup,
  design_books,
  design_empty,
  setup,
} from '../test-utils';
import { resolveDesignFilePath, resolveDesignsDirPath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads designs from the file system into the store', async () => {
    await initializeDesigns();

    expect(DesignsStore.get(design_books.id)).toEqual(design_books);
    expect(DesignsStore.get(design_empty.id)).toEqual(design_empty);
  });

  it('ignores entries which are not design bundles', async () => {
    MockFs.writeTextFile(
      `${resolveDesignsDirPath()}/stranger.other`,
      JSON.stringify({ id: 'stranger', name: 'stranger' }),
    );

    await initializeDesigns();

    expect(DesignsStore.get('stranger')).toBeNull();
  });

  it('handles failed design reads', async () => {
    MockFs.addFiles([
      {
        path: resolveDesignFilePath('invalid-design'),
        textContent: 'invalid json',
      },
    ]);

    await initializeDesigns();

    expect(
      DesignsStore.getAllArray().find((design) => !design),
    ).toBeUndefined();
  });
});
