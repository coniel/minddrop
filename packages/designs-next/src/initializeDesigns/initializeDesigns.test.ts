import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { DesignsStore } from '../DesignsStore';
import { DesignsLoadedEvent } from '../events';
import { MockFs, cleanup, designs, setup } from '../test-utils';
import { resolveDesignsDirPath } from '../utils';
import { initializeDesigns } from './initializeDesigns';

describe('initializeDesigns', () => {
  beforeEach(() => setup({ loadDesigns: false }));

  afterEach(cleanup);

  it('loads design files into the store', async () => {
    await initializeDesigns();

    expect(DesignsStore.getAllArray()).toEqual(designs);
  });

  it('ignores files without the design file extension', async () => {
    // A valid design in a file without the design file extension
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath()}/design_3.txt`,
        textContent: JSON.stringify({ ...designs[0], id: 'design_3' }),
      },
    ]);

    await initializeDesigns();

    expect(DesignsStore.getAllArray()).toEqual(designs);
  });

  it('discards entries which are not valid design files', async () => {
    // A file which is not a valid design
    MockFs.addFiles([
      {
        path: `${resolveDesignsDirPath()}/design_invalid.json`,
        textContent: JSON.stringify({ id: 'not-a-design' }),
      },
    ]);

    await initializeDesigns();

    expect(DesignsStore.getAllArray()).toEqual(designs);
  });

  it('dispatches the designs loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload).toEqual(designs);
          done();
        },
      );

      initializeDesigns();
    }));

  it('dispatches an empty loaded event if the directory does not exist', async () =>
    new Promise<void>((done) => {
      // Empty the mock file system so the designs directory is missing
      MockFs.clear();

      Events.addListener(
        DesignsLoadedEvent,
        'test-designs-loaded',
        (payload) => {
          expect(payload).toEqual([]);
          done();
        },
      );

      initializeDesigns();
    }));
});
